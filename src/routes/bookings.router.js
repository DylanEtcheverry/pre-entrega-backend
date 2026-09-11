import express from 'express';
import validate from '../middlewares/validate.middleware.js';
import {
  addServiceParamsSchema,
  bookingIdParamsSchema,
  createBookingSchema,
} from '../validations/bookings.validation.js';

export default function createBookingsRouter(bookingsController) {
  const router = express.Router();

  router.post('/', validate(createBookingSchema, 'body'), bookingsController.createBooking);
  router.get('/:bid', validate(bookingIdParamsSchema, 'params'), bookingsController.getBookingById);
  router.post(
    '/:bid/services/:sid',
    validate(addServiceParamsSchema, 'params'),
    bookingsController.addServiceToBooking
  );

  return router;
}
