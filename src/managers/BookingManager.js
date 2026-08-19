import fs from 'node:fs/promises';

export default class BookingManager {
  constructor(dataFile, serviceManager) {
    this.dataFile = dataFile;
    this.serviceManager = serviceManager;
  }

  async readData() {
    try {
      const raw = await fs.readFile(this.dataFile, 'utf8');
      return JSON.parse(raw);
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  async writeData(data) {
    await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2), 'utf8');
    return data;
  }

  validateBookingData(data) {
    const required = ['clientName', 'clientEmail', 'date', 'time', 'status'];
    const missing = required.filter((f) => data[f] === undefined || data[f] === null);
    if (missing.length > 0) throw new Error(`Missing fields: ${missing.join(', ')}`);
  }

  async createBooking(bookingData) {
    if (typeof bookingData !== 'object' || bookingData === null) {
      throw new Error('Booking data must be an object');
    }

    this.validateBookingData(bookingData);

    const bookings = await this.readData();
    const id = String(Date.now());
    const newBooking = {
      id,
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status,
      services: Array.isArray(bookingData.services) ? bookingData.services : [],
    };

    bookings.push(newBooking);
    await this.writeData(bookings);
    return newBooking;
  }

  async getBookingById(id) {
    const bookings = await this.readData();
    return bookings.find((b) => b.id === id) ?? null;
  }

  async addServiceToBooking(bookingId, serviceId) {
    const bookings = await this.readData();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    // validate service exists if serviceManager provided
    if (this.serviceManager) {
      const svc = await this.serviceManager.getServiceById(serviceId);
      if (!svc) throw new Error('Service not found');
    }

    const booking = bookings[index];
    const existing = booking.services.find((s) => String(s.service) === String(serviceId));
    if (existing) {
      existing.quantity = (existing.quantity || 0) + 1;
    } else {
      booking.services.push({ service: String(serviceId), quantity: 1 });
    }

    bookings[index] = booking;
    await this.writeData(bookings);
    return booking;
  }
}
