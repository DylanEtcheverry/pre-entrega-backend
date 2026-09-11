class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

export default class BookingsService {
  constructor(repository, servicesService) {
    this.repository = repository;
    this.servicesService = servicesService;
  }

  validateBookingData(data) {
    const requiredFields = ['clientName', 'clientEmail', 'date', 'time', 'status'];
    const missingFields = requiredFields.filter(
      (field) => data[field] === undefined || data[field] === null
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${missingFields.join(', ')}`);
    }
  }

  async createBooking(bookingData) {
    if (typeof bookingData !== 'object' || bookingData === null) {
      throw new Error('Booking data must be an object');
    }

    this.validateBookingData(bookingData);

    const booking = {
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status,
      services: Array.isArray(bookingData.services) ? bookingData.services : [],
    };

    return this.repository.create(booking);
  }

  getBookingById(id) {
    return this.repository.getById(id);
  }

  getBookings() {
    return this.repository.getAll();
  }

  async addServiceToBooking(bookingId, serviceId) {
    const booking = await this.repository.getById(bookingId);
    if (!booking) return null;

    const service = await this.servicesService.getServiceById(serviceId);
    if (!service) throw new NotFoundError('Service not found');

    const existing = booking.services.find((item) => String(item.service) === String(serviceId));
    if (existing) {
      existing.quantity = (existing.quantity || 0) + 1;
    } else {
      booking.services.push({ service: String(serviceId), quantity: 1 });
    }

    const { _id, ...bookingData } = booking;
    return this.repository.update(bookingId, bookingData);
  }
}