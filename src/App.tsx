import { StoreProvider } from './store';
import Toolbar from './components/Toolbar';
import LibraryPanel from './components/LibraryPanel';
import Viewport from './components/Viewport';
import InspectorPanel from './components/InspectorPanel';
import NewComponentDialog from './components/NewComponentDialog';
import ExportDialog from './components/ExportDialog';
import { useStore } from './store';

function Inner() {
  const { state } = useStore();
  return (
    <div className="app">
      <Toolbar />
      <div className="workspace">
        <LibraryPanel />
        <div className="viewport-area"><Viewport /></div>
        <InspectorPanel />
      </div>
      {state.showNewComponentDialog && <NewComponentDialog />}
      {state.showExportDialog && <ExportDialog />}
    </div>
  );
}

export default function App() {
  return <StoreProvider><Inner /></StoreProvider>;
}
