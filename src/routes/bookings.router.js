import express from 'express';

export default function createBookingsRouter(bookingManager, serviceManager) {
  const router = express.Router();

  // POST /api/bookings - create booking
  router.post('/', async (req, res) => {
    try {
      const created = await bookingManager.createBooking(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // GET /api/bookings/:bid
  router.get('/:bid', async (req, res) => {
    const { bid } = req.params;
    const booking = await bookingManager.getBookingById(bid);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json(booking);
  });

  // POST /api/bookings/:bid/services/:sid - add service to booking
  router.post('/:bid/services/:sid', async (req, res) => {
    const { bid, sid } = req.params;
    try {
      // ensure booking exists
      const booking = await bookingManager.getBookingById(bid);
      if (!booking) return res.status(404).json({ error: 'Booking not found' });

      // ensure service exists
      if (serviceManager) {
        const svc = await serviceManager.getServiceById(sid);
        if (!svc) return res.status(404).json({ error: 'Service not found' });
      }

      const updated = await bookingManager.addServiceToBooking(bid, sid);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
