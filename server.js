import { createServer } from 'node:http';
import { Server } from 'socket.io';
import envConfig from './src/config/env.config.js';
import connectDatabase from './src/config/database.config.js';
import { setSocketServer } from './src/config/realtime.config.js';
import app from './src/app.js';

try {
  await connectDatabase(envConfig.MONGO_URI);
  const httpServer = createServer(app);
  const io = new Server(httpServer);
  setSocketServer(io);

  httpServer.listen(envConfig.PORT, () => {
    console.log(`Server running on http://localhost:${envConfig.PORT}`);
  });
} catch (error) {
  console.error(`MongoDB connection failed: ${error.message}`);
  process.exit(1);
}
