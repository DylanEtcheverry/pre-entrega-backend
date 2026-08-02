import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import envConfig from './config/env.config.js';
import ServiceManager from '../managers/ServiceManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, './data/services.json');
const serviceManager = new ServiceManager(dataPath);

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', env: envConfig.NODE_ENV });
});

app.get('/services', async (req, res) => {
  const services = await serviceManager.getServices();
  res.json(services);
});

app.get('/services/:id', async (req, res) => {
  const service = await serviceManager.getServiceById(req.params.id);
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

app.post('/services', async (req, res) => {
  try {
    const service = await serviceManager.addService(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/services/:id', async (req, res) => {
  try {
    const updated = await serviceManager.updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/services/:id', async (req, res) => {
  const deleted = await serviceManager.deleteService(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Service not found' });
  res.json({ deleted: true });
});

app.listen(envConfig.PORT, () => {
  console.log(`Server running on http://localhost:${envConfig.PORT}`);
});
