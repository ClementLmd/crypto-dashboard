import app from './app';
import { createServer } from 'http';

const port = 3001;

const server = createServer(app);

server
  .listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  })
  .on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      server.listen(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

// Handle graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
