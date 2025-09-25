const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Access from other devices: http://YOUR_LOCAL_IP:${PORT}`);
  console.log('Make sure to replace YOUR_LOCAL_IP with your computer\'s local IP address');
});
