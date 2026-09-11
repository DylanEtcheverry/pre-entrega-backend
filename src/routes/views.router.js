import express from 'express';

export default function createViewsRouter(viewsController) {
  const router = express.Router();

  router.get('/services', viewsController.getServicesView);
  router.get('/availability', viewsController.getAvailabilityView);

  return router;
}