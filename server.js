const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer } = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');

const PORT = process.env.PORT || 1234;

const app = express();
const server = http.createServer(app);

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('OK');
});

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  console.log(`Client connected: ${req.url}`);
  setupWSConnection(ws, req);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`- Frontend: http://localhost:${PORT}`);
  console.log(`- WebSocket: ws://localhost:${PORT}`);
});
