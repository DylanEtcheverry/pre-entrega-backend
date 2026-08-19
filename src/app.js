import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import envConfig from './config/env.config.js';
import ServiceManager from './managers/ServiceManager.js';
import createServicesRouter from './routes/services.router.js';
import BookingManager from './managers/BookingManager.js';
import createBookingsRouter from './routes/bookings.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, './data/services.json');
const serviceManager = new ServiceManager(dataPath);
const bookingsPath = path.resolve(__dirname, './data/bookings.json');
const bookingManager = new BookingManager(bookingsPath, serviceManager);

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', env: envConfig.NODE_ENV });
});

// Mount services router at /api/services
const servicesRouter = createServicesRouter(serviceManager);
app.use('/api/services', servicesRouter);

const bookingsRouter = createBookingsRouter(bookingManager, serviceManager);
app.use('/api/bookings', bookingsRouter);

export default app;
