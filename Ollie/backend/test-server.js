const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 3001;
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Test server running on http://127.0.0.1:${PORT}`);
  console.log('Try accessing: http://127.0.0.1:' + PORT + '/health');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Keep alive
setTimeout(() => {}, 1000000);
