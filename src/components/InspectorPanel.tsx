import { useState } from 'react';
import { useStore } from '../store';
import { getTemplate } from '../data/componentLibrary';
import { PIPE_TYPES, PIPE_SIZES } from '../data/pipeTypes';
import type { PipeMaterialId } from '../types';
import { project, worldConnectionPos, worldConnectionNormal } from '../utils/projection';

function MiniViewer({ compId }: { compId: string }) {
  const { state } = useStore();
  const comp = state.placedComponents.find(c => c.id === compId);
  if (!comp) return null;
  const template = getTemplate(state.families, comp.templateId);
  if (!template) return null;
  const W = 220, H = 140;
  const { width: w, depth: d, height: h } = template;
  const maxDim = Math.max(w, d, h);
  const scale = Math.min((W * 0.4) / maxDim, (H * 0.45) / maxDim);
  const pan = { x: W/2, y: H * 0.65 };
  const view = 'iso-se';
  function p3(x: number, y: number, z: number) { const pr = project({ x, y, z }, view as any); return { x: pr.x * scale + pan.x, y: pr.y * scale + pan.y }; }
  const v = (x:number,y:number,z:number) => { const pt = p3(x,y,z); return `${pt.x},${pt.y}`; };
  return (
    <div className="mini-viewer">
      <svg width={W} height={H}>
        <polygon points={`${v(0,0,h)} ${v(w,0,h)} ${v(w,d,h)} ${v(0,d,h)}`} fill={template.topColor} stroke="#000" strokeWidth={0.5} />
        <polygon points={`${v(0,0,0)} ${v(w,0,0)} ${v(w,0,h)} ${v(0,0,h)}`} fill={template.color} stroke="#000" strokeWidth={0.5} />
        <polygon points={`${v(w,0,0)} ${v(w,d,0)} ${v(w,d,h)} ${v(w,0,h)}`} fill={template.sideColor} stroke="#000" strokeWidth={0.5} />
        {template.connections.map(cp => {
          const s = p3(cp.position.x, cp.position.y, cp.position.z);
          return (<g key={cp.id}>
            <circle cx={s.x} cy={s.y} r={Math.max(3, cp.nominalSize * scale * 0.2)} fill="#1a1d23" stroke="#4a90d9" strokeWidth={1.5} />
            <circle cx={s.x} cy={s.y} r={Math.max(1.5, cp.nominalSize * scale * 0.1)} fill="#4a90d9" />
          </g>);
        })}
        <text x={W/2} y={14} textAnchor="middle" fontSize={9} fill="#888" style={{ userSelect:'none', fontFamily:'monospace' }}>{template.name}</text>
      </svg>
    </div>
  );
}

export default function InspectorPanel() {
  const { state, dispatch } = useStore();
  const [labelEdit, setLabelEdit] = useState('');
  const [editingLabel, setEditingLabel] = useState(false);
  const selComp = state.selectedComponentId ? state.placedComponents.find(c => c.id === state.selectedComponentId) : null;
  const selTemplate = selComp ? getTemplate(state.families, selComp.templateId) : null;
  const selRoute = state.selectedPipeRouteId ? state.pipeRoutes.find(r => r.id === state.selectedPipeRouteId) : null;
  const selPipeType = selRoute ? PIPE_TYPES.find(p => p.id === selRoute.pipeTypeId) : null;
  function startLabelEdit() { setLabelEdit(selComp?.label ?? ''); setEditingLabel(true); }
  function commitLabel() { if (selComp) dispatch({ type: 'LABEL_COMPONENT', id: selComp.id, label: labelEdit }); setEditingLabel(false); }
  return (
    <div className="inspector-panel">
      <div className="panel-header"><span>Inspector</span></div>
      <div className="panel-scroll">
        {!selComp && !selRoute && (
          <div style={{ padding: 16, color: 'var(--text2)', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>\u2196</div>Select a component or pipe route to inspect it.
          </div>
        )}
        {selComp && selTemplate && (
          <>
            <MiniViewer compId={selComp.id} />
            <div className="inspector-section"><h4>Component</h4>
              <div className="insp-row"><span className="insp-label">Type</span><span className="insp-value">{selTemplate.name}</span></div>
              <div className="insp-row"><span className="insp-label">Family</span><span className="insp-value">{selTemplate.family}</span></div>
              <div className="insp-row"><span className="insp-label">Label</span>
                {editingLabel ? (
                  <input autoFocus className="insp-input" value={labelEdit} onChange={e => setLabelEdit(e.target.value)}
                    onBlur={commitLabel} onKeyDown={e => { if (e.key === 'Enter') commitLabel(); if (e.key === 'Escape') setEditingLabel(false); }} />
                ) : (
                  <span className="insp-value" style={{ cursor:'pointer', textDecoration:'underline dotted' }} onClick={startLabelEdit}>
                    {selComp.label || <em style={{color:'var(--text2)'}}>click to add label</em>}
                  </span>
                )}
              </div>
            </div>
            <div className="inspector-section"><h4>Position (inches)</h4>
              {(['x','y','z'] as const).map(axis => (
                <div key={axis} className="insp-row"><span className="insp-label">{axis.toUpperCase()}</span>
                  <input type="number" className="insp-input" value={Math.round(selComp.position[axis])}
                    onChange={e => dispatch({ type: 'MOVE_COMPONENT', id: selComp.id, position: { ...selComp.position, [axis]: Number(e.target.value) } })} />
                </div>
              ))}
              <div className="insp-row"><span className="insp-label">Rotation</span>
                <select className="insp-select" value={selComp.rotationY} onChange={e => dispatch({ type: 'ROTATE_COMPONENT', id: selComp.id, rotationY: Number(e.target.value) })}>
                  <option value={0}>0\u00b0</option><option value={90}>90\u00b0</option><option value={180}>180\u00b0</option><option value={270}>270\u00b0</option>
                </select>
              </div>
            </div>
            <div className="inspector-section"><h4>Dimensions (W \u00d7 D \u00d7 H)</h4>
              <div className="insp-row"><span className="insp-value">{selTemplate.width}" \u00d7 {selTemplate.depth}" \u00d7 {selTemplate.height}"</span></div>
            </div>
            <div className="inspector-section"><h4>Connection Points</h4>
              <div className="connection-list">
                {selTemplate.connections.map(cp => {
                  const wPos = worldConnectionPos(cp.position, selComp.position, selComp.rotationY);
                  const wNorm = worldConnectionNormal(cp.normal, selComp.rotationY);
                  return (<div key={cp.id} className="connection-badge">
                    <div className="connection-dot" style={{ background: '#4a90d9' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{cp.label}</div>
                      <div style={{ color: 'var(--text2)', fontSize: 10 }}>{cp.nominalSize}" \u2022 {cp.endType} \u2022 ({Math.round(wPos.x)}, {Math.round(wPos.y)}, {Math.round(wPos.z)})</div>
                    </div>
                  </div>);
                })}
              </div>
            </div>
            <div className="inspector-section">
              <button className="btn-secondary" style={{ width:'100%', marginBottom:6 }} onClick={() => dispatch({ type: 'DELETE_COMPONENT', id: selComp.id })}>✕ Delete Component</button>
            </div>
          </>
        )}
        {selRoute && (
          <>
            <div className="inspector-section"><h4>Pipe Route</h4>
              <div className="insp-row"><span className="insp-label">Material</span>
                <select className="insp-select" value={selRoute.pipeTypeId} onChange={e => dispatch({ type: 'UPDATE_PIPE_ROUTE', payload: { ...selRoute, pipeTypeId: e.target.value as PipeMaterialId } })}>
                  {PIPE_TYPES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="insp-row"><span className="insp-label">Size</span>
                <select className="insp-select" value={selRoute.nominalSize} onChange={e => dispatch({ type: 'UPDATE_PIPE_ROUTE', payload: { ...selRoute, nominalSize: Number(e.target.value) } })}>
                  {PIPE_SIZES.map(s => <option key={s} value={s}>{s}"</option>)}
                </select>
              </div>
              <div className="insp-row"><span className="insp-label">Color</span><div style={{ width:20, height:20, borderRadius:4, background: selPipeType?.color ?? '#888' }} /></div>
              <div className="insp-row"><span className="insp-label">Label</span>
                <input className="insp-input" value={selRoute.label ?? ''} placeholder="optional label" onChange={e => dispatch({ type: 'UPDATE_PIPE_ROUTE', payload: { ...selRoute, label: e.target.value } })} />
              </div>
            </div>
            <div className="inspector-section"><h4>Route Geometry</h4>
              <div className="insp-row"><span className="insp-label">Segments</span><span className="insp-value">{selRoute.segments.length}</span></div>
              <div className="insp-row"><span className="insp-label">Elbows</span><span className="insp-value">{selRoute.elbows.length}</span></div>
              <div className="insp-row"><span className="insp-label">Flanges</span><span className="insp-value">{selRoute.flanges.length}</span></div>
              <div className="insp-row"><span className="insp-label">Total length</span>
                <span className="insp-value">{(selRoute.segments.reduce((acc, seg) => { const dx=seg.end.x-seg.start.x,dy=seg.end.y-seg.start.y,dz=seg.end.z-seg.start.z; return acc+Math.sqrt(dx*dx+dy*dy+dz*dz); }, 0) / 12).toFixed(1)} ft</span>
              </div>
            </div>
            <div className="inspector-section">
              <button className="btn-secondary" style={{ width:'100%' }} onClick={() => dispatch({ type: 'DELETE_PIPE_ROUTE', id: selRoute.id })}>✕ Delete Pipe Route</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
