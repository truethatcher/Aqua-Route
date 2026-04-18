export interface Point3D { x: number; y: number; z: number }
export interface Point2D { x: number; y: number }

export type ConnectionEndType = 'flanged' | 'butt-weld' | 'roll-grooved' | 'threaded' | 'socket-weld' | 'mechanical-joint';

export interface ConnectionPoint {
  id: string; label: string; position: Point3D; normal: Point3D; nominalSize: number; endType: ConnectionEndType;
}

export type ComponentShape = 'box' | 'pump-centrifugal' | 'valve-gate' | 'valve-ball' | 'valve-butterfly' | 'valve-check' | 'valve-globe' | 'valve-prv' | 'meter' | 'strainer' | 'air-valve' | 'expansion-joint';

export interface ComponentTemplate {
  id: string; family: string; name: string; description: string;
  width: number; depth: number; height: number; shape: ComponentShape;
  color: string; topColor: string; sideColor: string; connections: ConnectionPoint[];
}

export interface PlacedComponent { id: string; templateId: string; position: Point3D; rotationY: number; label: string; }

export type PipeMaterialId = 'di-flanged' | 'di-grooved' | 'ms-flanged' | 'ms-butt-weld' | 'ms-butt-weld-flanged' | 'ss304-butt-weld' | 'ss304-butt-weld-flanged' | 'ss316-butt-weld' | 'ss316-butt-weld-flanged' | 'hdpe-butt-weld' | 'pvc-solvent-weld' | 'copper-soldered';

export interface PipeType { id: PipeMaterialId; name: string; material: string; endType: ConnectionEndType; color: string; strokeDash?: string; }

export interface PipeSegment { id: string; start: Point3D; end: Point3D; axis: 'x' | 'y' | 'z'; }
export interface PipeElbow { id: string; position: Point3D; inDir: Point3D; outDir: Point3D; }
export interface PipeFlange { id: string; position: Point3D; normal: Point3D; nominalSize: number; endType: ConnectionEndType; }

export interface PipeRoute {
  id: string; fromComponentId: string; fromConnectionId: string; toComponentId: string; toConnectionId: string;
  pipeTypeId: PipeMaterialId; nominalSize: number; segments: PipeSegment[]; elbows: PipeElbow[]; flanges: PipeFlange[];
  inlineComponents: Array<{ componentId: string; segmentId: string; t: number }>; label?: string;
}

export interface ComponentFamily { id: string; name: string; icon: string; templates: ComponentTemplate[]; }
export type ViewType = 'iso-se' | 'iso-sw' | 'front' | 'side';
export type ToolType = 'select' | 'connect' | 'pan';

export interface PendingConnection { componentId: string; connectionId: string; worldPos: Point3D; worldNormal: Point3D; nominalSize: number; }

export interface AppState {
  families: ComponentFamily[]; placedComponents: PlacedComponent[]; pipeRoutes: PipeRoute[];
  activeView: ViewType; viewportPan: Point2D; viewportScale: number;
  activeTool: ToolType; selectedComponentId: string | null; selectedPipeRouteId: string | null;
  hoveredConnection: { componentId: string; connectionId: string } | null; pendingConnection: PendingConnection | null;
  selectedPipeTypeId: PipeMaterialId; selectedPipeSize: number;
  showNewComponentDialog: boolean; showExportDialog: boolean; draggedSegmentId: string | null;
}

export type AppAction =
  | { type: 'PLACE_COMPONENT'; payload: PlacedComponent } | { type: 'MOVE_COMPONENT'; id: string; position: Point3D }
  | { type: 'DELETE_COMPONENT'; id: string } | { type: 'ROTATE_COMPONENT'; id: string; rotationY: number }
  | { type: 'LABEL_COMPONENT'; id: string; label: string } | { type: 'ADD_PIPE_ROUTE'; payload: PipeRoute }
  | { type: 'DELETE_PIPE_ROUTE'; id: string } | { type: 'UPDATE_PIPE_ROUTE'; payload: PipeRoute }
  | { type: 'INSERT_INLINE_COMPONENT'; routeId: string; componentId: string; segmentId: string; t: number }
  | { type: 'ADD_COMPONENT_TEMPLATE'; familyId: string; template: ComponentTemplate }
  | { type: 'SET_VIEW'; view: ViewType } | { type: 'SET_PAN'; pan: Point2D } | { type: 'SET_SCALE'; scale: number }
  | { type: 'SET_TOOL'; tool: ToolType } | { type: 'SELECT_COMPONENT'; id: string | null } | { type: 'SELECT_PIPE_ROUTE'; id: string | null }
  | { type: 'SET_HOVERED_CONNECTION'; payload: { componentId: string; connectionId: string } | null }
  | { type: 'SET_PENDING_CONNECTION'; payload: PendingConnection | null }
  | { type: 'SET_PIPE_TYPE'; id: PipeMaterialId } | { type: 'SET_PIPE_SIZE'; size: number }
  | { type: 'SHOW_NEW_COMPONENT_DIALOG'; show: boolean } | { type: 'SHOW_EXPORT_DIALOG'; show: boolean }
  | { type: 'SET_DRAGGED_SEGMENT'; id: string | null } | { type: 'MOVE_SEGMENT'; routeId: string; segmentId: string; offset: Point3D }
  | { type: 'UNDO' } | { type: 'REDO' };
