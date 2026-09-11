import mongoose from 'mongoose';
import Booking from '../models/booking.model.js';

function toPublicBooking(booking) {
  if (!booking) return null;

  const publicBooking = { ...booking, id: booking._id.toString() };
  delete publicBooking._id;
  delete publicBooking.__v;
  return publicBooking;
}

export default class BookingsDao {
  constructor(model = Booking) {
    this.model = model;
  }

  async getAll() {
    const bookings = await this.model.find().lean();
    return bookings.map(toPublicBooking);
  }

  async create(booking) {
    const created = await this.model.create(booking);
    return toPublicBooking(created.toObject());
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const booking = await this.model
      .findById(id)
      .populate({ path: 'services.service', model: 'Service' })
      .lean();
    return toPublicBooking(booking);
  }

  async update(id, booking) {
    if (!mongoose.isValidObjectId(id)) return null;
    const updated = await this.model
      .findByIdAndUpdate(id, booking, { new: true, runValidators: true })
      .lean();
    return toPublicBooking(updated);
  }
}