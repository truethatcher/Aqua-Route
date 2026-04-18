import { useState } from 'react';
import { useStore } from '../store';
import type { ComponentTemplate } from '../types';

export default function LibraryPanel() {
  const { state, dispatch } = useStore();
  const [openFamilies, setOpenFamilies] = useState<Set<string>>(new Set(['pumps']));
  const [search, setSearch] = useState('');

  function toggleFamily(id: string) {
    setOpenFamilies(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  function onDragStart(e: React.DragEvent, template: ComponentTemplate) {
    e.dataTransfer.setData('application/aqua-template-id', template.id);
    e.dataTransfer.effectAllowed = 'copy';
  }

  const q = search.toLowerCase();
  return (
    <div className="library-panel">
      <div className="panel-header"><span>Components</span></div>
      <div style={{ padding: '8px', borderBottom: '1px solid var(--border)' }}>
        <input className="form-input" style={{ width: '100%', padding: '5px 8px', fontSize: 12 }}
          placeholder="Search\u2026" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="panel-scroll">
        {state.families.map(family => {
          const filtered = q ? family.templates.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) : family.templates;
          if (q && filtered.length === 0) return null;
          const open = openFamilies.has(family.id);
          return (
            <div key={family.id} className="family-group">
              <div className="family-header" onClick={() => toggleFamily(family.id)}>
                <span>{family.icon}</span>
                <span style={{ flex: 1 }}>{family.name}</span>
                <span className="family-chevron">▶</span>
              </div>
              {(open || q) && filtered.map(t => (
                <div key={t.id} className="component-item" draggable onDragStart={e => onDragStart(e, t)}
                  onClick={() => dispatch({ type: 'SELECT_COMPONENT', id: null })} title={t.description}>
                  <div className="comp-swatch" style={{ background: t.color, border: `1px solid ${t.topColor}` }} />
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <button className="add-component-btn" onClick={() => dispatch({ type: 'SHOW_NEW_COMPONENT_DIALOG', show: true })}>+ Create Custom Component</button>
    </div>
  );
}
