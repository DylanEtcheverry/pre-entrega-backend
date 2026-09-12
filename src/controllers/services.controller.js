import { emitRealtime } from '../config/realtime.config.js';

export default function createServicesController(servicesService) {
  async function getServices(req, res) {
    try {
      const services = await servicesService.getServices(req.validated.query);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async function getServiceById(req, res) {
    const { sid } = req.validated.params;
    const service = await servicesService.getServiceById(sid);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.status(200).json(service);
  }

  async function createService(req, res) {
    try {
      const created = await servicesService.createService(req.validated.body);
      emitRealtime('service:created', created);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async function updateService(req, res) {
    try {
      const { sid } = req.validated.params;
      const updated = await servicesService.updateService(sid, req.validated.body);
      if (!updated) return res.status(404).json({ error: 'Service not found' });
      emitRealtime('service:updated', updated);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async function deleteService(req, res) {
    const { sid } = req.validated.params;
    const deleted = await servicesService.deleteService(sid);
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    emitRealtime('service:deleted', { id: deleted.id });
    res.status(200).json({ deleted: true });
  }

  return { getServices, getServiceById, createService, updateService, deleteService };
}