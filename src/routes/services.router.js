import express from 'express';

export default function createServicesRouter(serviceManager) {
  const router = express.Router();

  // GET /api/services?category=&available=
  router.get('/', async (req, res) => {
    try {
      const { category, available } = req.query;
      let services = await serviceManager.getServices();

      if (category) {
        services = services.filter((s) => String(s.category) === String(category));
      }

      if (available !== undefined) {
        const availBool = available === 'true' || available === true;
        services = services.filter((s) => Boolean(s.available) === availBool);
      }

      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/services/:sid
  router.get('/:sid', async (req, res) => {
    const { sid } = req.params;
    const service = await serviceManager.getServiceById(sid);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.status(200).json(service);
  });

  // POST /api/services
  router.post('/', async (req, res) => {
    try {
      if ('id' in req.body) {
        return res.status(400).json({ error: 'Do not include id in request body' });
      }

      const created = await serviceManager.addService(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // PUT /api/services/:sid
  router.put('/:sid', async (req, res) => {
    try {
      const { sid } = req.params;
      const updated = await serviceManager.updateService(sid, req.body);
      if (!updated) return res.status(404).json({ error: 'Service not found' });
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /api/services/:sid
  router.delete('/:sid', async (req, res) => {
    const { sid } = req.params;
    const deleted = await serviceManager.deleteService(sid);
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    res.status(200).json({ deleted: true });
  });

  return router;
}
