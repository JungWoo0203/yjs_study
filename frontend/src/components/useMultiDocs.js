import { useState, useCallback, useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function getRandomName() {
  const adjectives = ['Happy', 'Swift', 'Clever', 'Bright', 'Calm'];
  const nouns = ['Panda', 'Tiger', 'Eagle', 'Dolphin', 'Fox'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

export function useMultiDocs(options = {}) {
  const {
    wsUrl = `wss://${window.location.host}`,
    roomPrefix = 'multi-docs-poc',
    userName,
  } = options;

  const [documents, setDocuments] = useState([]);
  const [activeDocIds, setActiveDocIds] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [userInfo] = useState(() => ({
    name: userName || getRandomName(),
    color: getRandomColor(),
  }));

  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const docsMetaRef = useRef(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new WebsocketProvider(
      wsUrl,
      `${roomPrefix}-metadata`,
      ydoc
    );
    providerRef.current = provider;

    provider.awareness.setLocalStateField('user', {
      name: userInfo.name,
      color: userInfo.color,
    });

    const docsMeta = ydoc.getMap('documents-meta');
    docsMetaRef.current = docsMeta;

    provider.on('status', ({ status }) => {
      setConnectionStatus(status);
    });

    const updateDocuments = () => {
      const docs = [];
      docsMeta.forEach((doc, key) => {
        docs.push({ ...doc, id: key });
      });
      docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setDocuments(docs);
    };

    docsMeta.observe(updateDocuments);
    updateDocuments();

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [wsUrl, roomPrefix, userInfo]);

  const createDocument = useCallback((title) => {
    const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newDoc = { id, title, createdAt: new Date() };
    docsMetaRef.current?.set(id, newDoc);
    return id;
  }, []);

  const deleteDocument = useCallback((docId) => {
    docsMetaRef.current?.delete(docId);
    setActiveDocIds((prev) => prev.filter((id) => id !== docId));
  }, []);

  const renameDocument = useCallback((docId, newTitle) => {
    const existingDoc = docsMetaRef.current?.get(docId);
    if (existingDoc) {
      docsMetaRef.current?.set(docId, { ...existingDoc, title: newTitle });
    }
  }, []);

  const openDocument = useCallback((docId) => {
    setActiveDocIds((prev) => {
      if (prev.includes(docId)) return prev;
      return [...prev, docId];
    });
  }, []);

  const closeDocument = useCallback((docId) => {
    setActiveDocIds((prev) => prev.filter((id) => id !== docId));
  }, []);

  const getYDoc = useCallback(() => ydocRef.current, []);
  const getProvider = useCallback(() => providerRef.current, []);

  return {
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
  };
}
