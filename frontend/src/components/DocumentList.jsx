import { useState } from 'react';

export function DocumentList({
  documents,
  activeDocIds,
  onOpenDocument,
  onCreateDocument,
  onDeleteDocument,
  onRenameDocument,
}) {
  const [newDocTitle, setNewDocTitle] = useState('');
  const [editingDocId, setEditingDocId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreate = () => {
    if (newDocTitle.trim()) {
      onCreateDocument(newDocTitle.trim());
      setNewDocTitle('');
    }
  };

  const handleStartRename = (doc) => {
    setEditingDocId(doc.id);
    setEditTitle(doc.title);
  };

  const handleSaveRename = () => {
    if (editingDocId && editTitle.trim()) {
      onRenameDocument(editingDocId, editTitle.trim());
      setEditingDocId(null);
      setEditTitle('');
    }
  };

  return (
    <div style={{
      width: '256px',
      background: '#f9fafb',
      borderRight: '1px solid #e5e7eb',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Documents</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="New document title"
            style={{
              flex: 1,
              padding: '4px 8px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button
            onClick={handleCreate}
            disabled={!newDocTitle.trim()}
            style={{
              padding: '4px 12px',
              fontSize: '14px',
              background: newDocTitle.trim() ? '#3b82f6' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: newDocTitle.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {documents.length === 0 ? (
          <p style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
            No documents yet. Create one above!
          </p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {documents.map((doc) => (
              <li
                key={doc.id}
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #e5e7eb',
                  background: activeDocIds.includes(doc.id) ? '#dbeafe' : 'transparent'
                }}
              >
                {editingDocId === doc.id ? (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                      style={{ flex: 1, padding: '4px 8px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '4px' }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveRename}
                      style={{ padding: '4px 8px', fontSize: '12px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      style={{ fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}
                      onClick={() => onOpenDocument(doc.id)}
                    >
                      {doc.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button
                        onClick={() => onOpenDocument(doc.id)}
                        style={{ fontSize: '12px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleStartRename(doc)}
                        style={{ fontSize: '12px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
