import app from './app';
import { createServer } from 'http';

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 4000;
  const server = createServer(app);

  // Add keep-alive configuration
  server.keepAliveTimeout = 61 * 1000; // 61 seconds
  server.headersTimeout = 65 * 1000; // 65 seconds

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  // Add error handling
  server.on('error', (error) => {
    console.error('Server error:', error);
  });

  // Handle process termination
  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

export default app;
