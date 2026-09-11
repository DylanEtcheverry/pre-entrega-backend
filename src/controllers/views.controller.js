export default function createViewsController(servicesService, bookingsService) {
  async function getServicesView(req, res) {
    try {
      const { services } = await servicesService.getServices({ limit: 100 });
      res.render('services', { title: 'Services', services });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async function getAvailabilityView(req, res) {
    try {
      const [{ services }, bookings] = await Promise.all([
        servicesService.getServices({ limit: 100 }),
        bookingsService.getBookings(),
      ]);

      res.render('availability', {
        title: 'Availability',
        services,
        bookings,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  return { getServicesView, getAvailabilityView };
}