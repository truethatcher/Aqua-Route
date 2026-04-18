import { useStore } from '../store';
import type { ViewType, ToolType, PipeMaterialId } from '../types';
import { PIPE_TYPES, PIPE_SIZES } from '../data/pipeTypes';

export default function Toolbar() {
  const { state, dispatch, canUndo, canRedo } = useStore();
  const views: { id: ViewType; label: string }[] = [
    { id: 'iso-se', label: 'ISO SE' }, { id: 'iso-sw', label: 'ISO SW' },
    { id: 'front', label: 'Front' }, { id: 'side', label: 'Side' },
  ];
  const tools: { id: ToolType; label: string; title: string }[] = [
    { id: 'select', label: '\u2196 Select', title: 'Select / Move components' },
    { id: 'connect', label: '\u2341 Connect', title: 'Click two connection points to route a pipe' },
    { id: 'pan', label: '\u2725 Pan', title: 'Pan the viewport' },
  ];
  const sel = state.selectedComponentId || state.selectedPipeRouteId;
  return (
    <div className="toolbar">
      <span className="app-title">Aqua-Route</span>
      <div className="tb-divider" />
      <button className="tb-btn" disabled={!canUndo} onClick={() => dispatch({ type: 'UNDO' })} title="Undo">↩</button>
      <button className="tb-btn" disabled={!canRedo} onClick={() => dispatch({ type: 'REDO' })} title="Redo">↪</button>
      <div className="tb-divider" />
      <span className="tb-label">View:</span>
      {views.map(v => (
        <button key={v.id} className={`tb-btn${state.activeView === v.id ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_VIEW', view: v.id })}>{v.label}</button>
      ))}
      <div className="tb-divider" />
      {tools.map(t => (
        <button key={t.id} className={`tb-btn${state.activeTool === t.id ? ' active' : ''}`}
          title={t.title} onClick={() => dispatch({ type: 'SET_TOOL', tool: t.id })}>{t.label}</button>
      ))}
      <div className="tb-divider" />
      {state.activeTool === 'connect' && (
        <>
          <span className="tb-label">Pipe:</span>
          <select className="tb-select" value={state.selectedPipeTypeId} style={{ maxWidth: 200 }}
            onChange={e => dispatch({ type: 'SET_PIPE_TYPE', id: e.target.value as PipeMaterialId })}>
            {PIPE_TYPES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <span className="tb-label">Size:</span>
          <select className="tb-select" value={state.selectedPipeSize}
            onChange={e => dispatch({ type: 'SET_PIPE_SIZE', size: Number(e.target.value) })}>
            {PIPE_SIZES.map(s => <option key={s} value={s}>{s}"</option>)}
          </select>
          <div className="tb-divider" />
        </>
      )}
      {sel && (
        <button className="tb-btn danger" onClick={() => {
          if (state.selectedComponentId) dispatch({ type: 'DELETE_COMPONENT', id: state.selectedComponentId });
          if (state.selectedPipeRouteId) dispatch({ type: 'DELETE_PIPE_ROUTE', id: state.selectedPipeRouteId });
        }}>✕ Delete</button>
      )}
      {state.selectedComponentId && (
        <>
          <button className="tb-btn" title="Rotate 90\u00b0 CCW" onClick={() => {
            const c = state.placedComponents.find(c => c.id === state.selectedComponentId);
            if (c) dispatch({ type: 'ROTATE_COMPONENT', id: c.id, rotationY: ((c.rotationY - 90) + 360) % 360 });
          }}>↺ 90°</button>
          <button className="tb-btn" title="Rotate 90\u00b0 CW" onClick={() => {
            const c = state.placedComponents.find(c => c.id === state.selectedComponentId);
            if (c) dispatch({ type: 'ROTATE_COMPONENT', id: c.id, rotationY: (c.rotationY + 90) % 360 });
          }}>↻ 90°</button>
        </>
      )}
      <div className="tb-spacer" />
      <button className="tb-btn" onClick={() => dispatch({ type: 'SHOW_EXPORT_DIALOG', show: true })}>&#128208; Export Drawing</button>
      <button className="tb-btn" onClick={() => dispatch({ type: 'SHOW_NEW_COMPONENT_DIALOG', show: true })}>+ New Component</button>
    </div>
  );
}
