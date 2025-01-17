import app from './app';
import { createServer } from 'http';

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 4000;
  const server = createServer(app);

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
