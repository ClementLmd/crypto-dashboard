import app from './app';

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 4000;
  const server = require('http').createServer(app);
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
