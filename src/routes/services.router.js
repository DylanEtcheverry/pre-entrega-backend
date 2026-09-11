import express from 'express';
import validate from '../middlewares/validate.middleware.js';
import {
  createServiceSchema,
  serviceIdParamsSchema,
  servicesQuerySchema,
  updateServiceSchema,
} from '../validations/services.validation.js';

export default function createServicesRouter(servicesController) {
  const router = express.Router();

  router.get('/', validate(servicesQuerySchema, 'query'), servicesController.getServices);
  router.get('/:sid', validate(serviceIdParamsSchema, 'params'), servicesController.getServiceById);
  router.post('/', validate(createServiceSchema, 'body'), servicesController.createService);
  router.put(
    '/:sid',
    validate(serviceIdParamsSchema, 'params'),
    validate(updateServiceSchema, 'body'),
    servicesController.updateService
  );
  router.delete('/:sid', validate(serviceIdParamsSchema, 'params'), servicesController.deleteService);

  return router;
}
