import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { useMemo, useEffect, useState } from 'react';

export function CollaborativeEditor({ docId, ydoc, provider, userInfo, className }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fragment = useMemo(() => {
    return ydoc.getXmlFragment(`document-${docId}`);
  }, [ydoc, docId]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ fragment }),
      CollaborationCursor.configure({
        provider,
        user: { name: userInfo.name, color: userInfo.color },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[200px] p-4',
      },
    },
  }, [fragment, provider, userInfo]);

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (!isMounted) {
    return (
      <div className={className}>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: 'white' }}>
          <div style={{ background: '#f5f5f5', padding: '8px 16px', borderBottom: '1px solid #ddd' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Document: {docId}</span>
          </div>
          <div style={{ minHeight: '200px', padding: '16px', color: '#999' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <style>{`
        .collaboration-cursor__caret {
          border-left: 1px solid;
          border-right: 1px solid;
          margin-left: -1px;
          margin-right: -1px;
          pointer-events: none;
          position: relative;
          word-break: normal;
        }
        .collaboration-cursor__label {
          border-radius: 3px 3px 3px 0;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          left: -1px;
          line-height: normal;
          padding: 0.1rem 0.3rem;
          position: absolute;
          top: -1.4em;
          user-select: none;
          white-space: nowrap;
        }
        .ProseMirror {
          min-height: 200px;
          padding: 16px;
          outline: none;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
      `}</style>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: 'white' }}>
        <div style={{
          background: '#f5f5f5',
          padding: '8px 16px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '14px', color: '#666' }}>Document: {docId}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: userInfo.color
            }} />
            <span style={{ fontSize: '12px', color: '#999' }}>{userInfo.name}</span>
          </div>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
