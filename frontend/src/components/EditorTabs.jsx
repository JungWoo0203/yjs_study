import { CollaborativeEditor } from './CollaborativeEditor';

export function EditorTabs({ documents, activeDocIds, ydoc, provider, userInfo, onCloseDocument }) {
  const activeDocuments = documents.filter((doc) => activeDocIds.includes(doc.id));

  if (!ydoc || !provider) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <p style={{ color: '#6b7280' }}>Connecting to server...</p>
      </div>
    );
  }

  if (activeDocuments.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', marginBottom: '8px' }}>No documents open</p>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            Select a document from the list or create a new one
          </p>
        </div>
      </div>
    );
  }

  const getGridStyle = () => {
    const len = activeDocuments.length;
    if (len === 1) return { gridTemplateColumns: '1fr' };
    if (len === 2) return { gridTemplateColumns: '1fr 1fr' };
    if (len <= 4) return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
    return { gridTemplateColumns: '1fr 1fr 1fr' };
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', background: '#e5e7eb', borderBottom: '1px solid #d1d5db', overflowX: 'auto' }}>
        {activeDocuments.map((doc) => (
          <div
            key={doc.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'white',
              borderRight: '1px solid #d1d5db',
              cursor: 'default'
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: '500', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.title}
            </span>
            <button
              onClick={() => onCloseDocument(doc.id)}
              style={{
                color: '#9ca3af',
                fontSize: '18px',
                lineHeight: 1,
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              title="Close"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px', background: '#f3f4f6' }}>
        <div style={{
          display: 'grid',
          gap: '16px',
          height: '100%',
          ...getGridStyle()
        }}>
          {activeDocuments.map((doc) => (
            <CollaborativeEditor
              key={doc.id}
              docId={doc.id}
              ydoc={ydoc}
              provider={provider}
              userInfo={userInfo}
              style={{ height: '100%', minHeight: '300px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
