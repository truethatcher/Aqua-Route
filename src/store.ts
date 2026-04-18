import { createContext, useContext, useReducer, Dispatch, createElement } from 'react';
import type { AppState, AppAction, PipeMaterialId, PipeRoute } from './types';
import { DEFAULT_FAMILIES } from './data/componentLibrary';
import { rebuildElbows } from './utils/routing';
import { add3 } from './utils/projection';

export const INITIAL_STATE: AppState = {
  families: DEFAULT_FAMILIES,
  placedComponents: [],
  pipeRoutes: [],
  activeView: 'iso-se',
  viewportPan: { x: 600, y: 400 },
  viewportScale: 3,
  activeTool: 'select',
  selectedComponentId: null,
  selectedPipeRouteId: null,
  hoveredConnection: null,
  pendingConnection: null,
  selectedPipeTypeId: 'di-flanged' as PipeMaterialId,
  selectedPipeSize: 6,
  showNewComponentDialog: false,
  showExportDialog: false,
  draggedSegmentId: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'PLACE_COMPONENT': return { ...state, placedComponents: [...state.placedComponents, action.payload] };
    case 'MOVE_COMPONENT': return { ...state, placedComponents: state.placedComponents.map(c => c.id === action.id ? { ...c, position: action.position } : c) };
    case 'DELETE_COMPONENT': {
      const routesToDelete = state.pipeRoutes.filter(r => r.fromComponentId === action.id || r.toComponentId === action.id).map(r => r.id);
      return { ...state, placedComponents: state.placedComponents.filter(c => c.id !== action.id), pipeRoutes: state.pipeRoutes.filter(r => !routesToDelete.includes(r.id)), selectedComponentId: state.selectedComponentId === action.id ? null : state.selectedComponentId };
    }
    case 'ROTATE_COMPONENT': return { ...state, placedComponents: state.placedComponents.map(c => c.id === action.id ? { ...c, rotationY: action.rotationY } : c) };
    case 'LABEL_COMPONENT': return { ...state, placedComponents: state.placedComponents.map(c => c.id === action.id ? { ...c, label: action.label } : c) };
    case 'ADD_PIPE_ROUTE': return { ...state, pipeRoutes: [...state.pipeRoutes, action.payload], pendingConnection: null };
    case 'DELETE_PIPE_ROUTE': return { ...state, pipeRoutes: state.pipeRoutes.filter(r => r.id !== action.id), selectedPipeRouteId: state.selectedPipeRouteId === action.id ? null : state.selectedPipeRouteId };
    case 'UPDATE_PIPE_ROUTE': return { ...state, pipeRoutes: state.pipeRoutes.map(r => r.id === action.payload.id ? action.payload : r) };
    case 'MOVE_SEGMENT': {
      const route = state.pipeRoutes.find(r => r.id === action.routeId);
      if (!route) return state;
      const segIdx = route.segments.findIndex(s => s.id === action.segmentId);
      if (segIdx < 0) return state;
      const seg = route.segments[segIdx];
      const newSegments = route.segments.map((s, i) => {
        if (i === segIdx) return { ...s, start: add3(s.start, action.offset), end: add3(s.end, action.offset) };
        if (i === segIdx - 1) return { ...s, end: add3(seg.start, action.offset) };
        if (i === segIdx + 1) return { ...s, start: add3(seg.end, action.offset) };
        return s;
      });
      const updated: PipeRoute = { ...route, segments: newSegments, elbows: rebuildElbows(newSegments) };
      return { ...state, pipeRoutes: state.pipeRoutes.map(r => r.id === action.routeId ? updated : r) };
    }
    case 'INSERT_INLINE_COMPONENT': {
      const route = state.pipeRoutes.find(r => r.id === action.routeId);
      if (!route) return state;
      const updated: PipeRoute = { ...route, inlineComponents: [...route.inlineComponents, { componentId: action.componentId, segmentId: action.segmentId, t: action.t }] };
      return { ...state, pipeRoutes: state.pipeRoutes.map(r => r.id === action.routeId ? updated : r) };
    }
    case 'ADD_COMPONENT_TEMPLATE': {
      const families = state.families.map(f => f.id !== action.familyId ? f : { ...f, templates: [...f.templates, action.template] });
      return { ...state, families };
    }
    case 'SET_VIEW': return { ...state, activeView: action.view };
    case 'SET_PAN': return { ...state, viewportPan: action.pan };
    case 'SET_SCALE': return { ...state, viewportScale: action.scale };
    case 'SET_TOOL': return { ...state, activeTool: action.tool, pendingConnection: null };
    case 'SELECT_COMPONENT': return { ...state, selectedComponentId: action.id, selectedPipeRouteId: null };
    case 'SELECT_PIPE_ROUTE': return { ...state, selectedPipeRouteId: action.id, selectedComponentId: null };
    case 'SET_HOVERED_CONNECTION': return { ...state, hoveredConnection: action.payload };
    case 'SET_PENDING_CONNECTION': return { ...state, pendingConnection: action.payload };
    case 'SET_PIPE_TYPE': return { ...state, selectedPipeTypeId: action.id };
    case 'SET_PIPE_SIZE': return { ...state, selectedPipeSize: action.size };
    case 'SHOW_NEW_COMPONENT_DIALOG': return { ...state, showNewComponentDialog: action.show };
    case 'SHOW_EXPORT_DIALOG': return { ...state, showExportDialog: action.show };
    case 'SET_DRAGGED_SEGMENT': return { ...state, draggedSegmentId: action.id };
    default: return state;
  }
}

interface HistoryState { past: AppState[]; present: AppState; future: AppState[]; }

const EPHEMERAL_ACTIONS = new Set<AppAction['type']>(['SET_VIEW','SET_PAN','SET_SCALE','SET_TOOL','SELECT_COMPONENT','SELECT_PIPE_ROUTE','SET_HOVERED_CONNECTION','SET_PENDING_CONNECTION','SET_PIPE_TYPE','SET_PIPE_SIZE','SHOW_NEW_COMPONENT_DIALOG','SHOW_EXPORT_DIALOG','SET_DRAGGED_SEGMENT']);

function historyReducer(hist: HistoryState, action: AppAction): HistoryState {
  if (action.type === 'UNDO') {
    if (hist.past.length === 0) return hist;
    const previous = hist.past[hist.past.length - 1];
    return { past: hist.past.slice(0, -1), present: previous, future: [hist.present, ...hist.future] };
  }
  if (action.type === 'REDO') {
    if (hist.future.length === 0) return hist;
    const next = hist.future[0];
    return { past: [...hist.past, hist.present], present: next, future: hist.future.slice(1) };
  }
  const next = appReducer(hist.present, action);
  if (EPHEMERAL_ACTIONS.has(action.type)) return { ...hist, present: next };
  return { past: [...hist.past.slice(-50), hist.present], present: next, future: [] };
}

type StoreCtx = { state: AppState; dispatch: Dispatch<AppAction>; canUndo: boolean; canRedo: boolean; };

export const StoreContext = createContext<StoreCtx>({ state: INITIAL_STATE, dispatch: () => {}, canUndo: false, canRedo: false });

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hist, dispatch] = useReducer(historyReducer, { past: [], present: INITIAL_STATE, future: [] });
  const ctx: StoreCtx = { state: hist.present, dispatch, canUndo: hist.past.length > 0, canRedo: hist.future.length > 0 };
  return createElement(StoreContext.Provider, { value: ctx }, children);
}

export function useStore() { return useContext(StoreContext); }
