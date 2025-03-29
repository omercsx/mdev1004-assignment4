/**
 * Simple static file server for the Recipe Manager UI
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html for all routes (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`UI server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
}); 