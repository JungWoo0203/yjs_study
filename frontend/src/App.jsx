import { useMultiDocs } from './components/useMultiDocs';
import { DocumentList } from './components/DocumentList';
import { EditorTabs } from './components/EditorTabs';

function App() {
  const {
    documents,
    activeDocIds,
    connectionStatus,
    userInfo,
    createDocument,
    deleteDocument,
    renameDocument,
    openDocument,
    closeDocument,
    getYDoc,
    getProvider,
  } = useMultiDocs({
    wsUrl: import.meta.env.PROD
      ? `wss://${window.location.host}`
      : 'ws://localhost:1234',
    roomPrefix: 'yjs-poc',
  });

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Yjs Multi-Docs POC</h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Real-time collaborative editing with multiple documents
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '14px',
              background: '#f3f4f6'
            }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: userInfo.color
              }} />
              <span style={{ color: '#374151' }}>{userInfo.name}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '14px',
              background: connectionStatus === 'connected' ? '#dcfce7' : connectionStatus === 'connecting' ? '#fef9c3' : '#fee2e2',
              color: connectionStatus === 'connected' ? '#15803d' : connectionStatus === 'connecting' ? '#a16207' : '#b91c1c'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: connectionStatus === 'connected' ? '#22c55e' : connectionStatus === 'connecting' ? '#eab308' : '#ef4444'
              }} />
              {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {activeDocIds.length} doc(s) open
            </div>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <DocumentList
          documents={documents}
          activeDocIds={activeDocIds}
          onOpenDocument={openDocument}
          onCreateDocument={createDocument}
          onDeleteDocument={deleteDocument}
          onRenameDocument={renameDocument}
        />
        <EditorTabs
          documents={documents}
          activeDocIds={activeDocIds}
          ydoc={getYDoc()}
          provider={getProvider()}
          userInfo={userInfo}
          onCloseDocument={closeDocument}
        />
      </div>
    </div>
  );
}

export default App;
