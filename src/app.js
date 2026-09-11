import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { engine } from 'express-handlebars';
import envConfig from './config/env.config.js';
import ServicesDao from './dao/services.dao.js';
import BookingsDao from './dao/bookings.dao.js';
import ServicesRepository from './repositories/services.repository.js';
import BookingsRepository from './repositories/bookings.repository.js';
import ServicesService from './services/services.service.js';
import BookingsService from './services/bookings.service.js';
import createHealthController from './controllers/health.controller.js';
import createServicesController from './controllers/services.controller.js';
import createServicesRouter from './routes/services.router.js';
import createBookingsController from './controllers/bookings.controller.js';
import createBookingsRouter from './routes/bookings.router.js';
import createViewsController from './controllers/views.controller.js';
import createViewsRouter from './routes/views.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewsPath = path.resolve(__dirname, './views');
const publicPath = path.resolve(__dirname, './public');
const servicesDao = new ServicesDao();
const bookingsDao = new BookingsDao();
const servicesRepository = new ServicesRepository(servicesDao);
const bookingsRepository = new BookingsRepository(bookingsDao);
const servicesService = new ServicesService(servicesRepository);
const bookingsService = new BookingsService(bookingsRepository, servicesService);
const servicesController = createServicesController(servicesService);
const bookingsController = createBookingsController(bookingsService);
const viewsController = createViewsController(servicesService, bookingsService);

const app = express();
app.use(express.json());
app.engine('handlebars', engine({
	defaultLayout: 'main',
	layoutsDir: path.join(viewsPath, 'layouts'),
}));
app.set('view engine', 'handlebars');
app.set('views', viewsPath);
app.use(express.static(publicPath));

app.get('/', createHealthController(envConfig));

const servicesRouter = createServicesRouter(servicesController);
app.use('/api/services', servicesRouter);

const bookingsRouter = createBookingsRouter(bookingsController);
app.use('/api/bookings', bookingsRouter);

const viewsRouter = createViewsRouter(viewsController);
app.use('/views', viewsRouter);

export default app;
