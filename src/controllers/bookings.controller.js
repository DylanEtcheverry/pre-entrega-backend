export default function createBookingsController(bookingsService) {
  async function createBooking(req, res) {
    try {
      const created = await bookingsService.createBooking(req.validated.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async function getBookingById(req, res) {
    const { bid } = req.validated.params;
    const booking = await bookingsService.getBookingById(bid);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json(booking);
  }

  async function addServiceToBooking(req, res) {
    const { bid, sid } = req.validated.params;

    try {
      const updated = await bookingsService.addServiceToBooking(bid, sid);
      if (!updated) return res.status(404).json({ error: 'Booking not found' });

      res.status(200).json(updated);
    } catch (error) {
      const statusCode = error.statusCode || 400;
      res.status(statusCode).json({ error: error.message });
    }
  }

  return { createBooking, getBookingById, addServiceToBooking };
}