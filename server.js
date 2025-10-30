const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - decode URI components before sending to client
app.get('*', (req, res, next) => {
  // Decode URI components to handle encoded characters
  const decodedPath = decodeURIComponent(req.path);
  
  // If the path contains encoded spaces, redirect to the decoded version
  if (req.path.includes('%20') && req.path === encodeURI(decodedPath)) {
    return res.redirect(302, decodedPath);
  }
  
  next();
});

// Serve index.html for all routes to support client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Access from other devices: http://YOUR_LOCAL_IP:${PORT}`);
  console.log('Make sure to replace YOUR_LOCAL_IP with your computer\'s local IP address');
});
