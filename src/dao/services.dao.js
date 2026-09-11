import mongoose from 'mongoose';
import Service from '../models/service.model.js';

function toPublicService(service) {
  if (!service) return null;

  const publicService = { ...service, id: service._id.toString() };
  delete publicService._id;
  delete publicService.__v;
  return publicService;
}

export default class ServicesDao {
  constructor(model = Service) {
    this.model = model;
  }

  async getAll({ category, available, page, limit, sortBy, order } = {}) {
    const filters = {};
    if (category) filters.category = category;
    if (available !== undefined) filters.available = available;

    const total = await this.model.countDocuments(filters);
    let query = this.model.find(filters);

    if (sortBy) {
      query = query.sort({ [sortBy]: order === 'desc' ? -1 : 1 });
    }

    const services = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { services: services.map(toPublicService), total };
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    return toPublicService(await this.model.findById(id).lean());
  }

  async create(service) {
    const created = await this.model.create(service);
    return toPublicService(created.toObject());
  }

  async update(id, service) {
    if (!mongoose.isValidObjectId(id)) return null;
    const updated = await this.model
      .findByIdAndUpdate(id, service, { new: true, runValidators: true })
      .lean();
    return toPublicService(updated);
  }

  async delete(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const deleted = await this.model.findByIdAndDelete(id).lean();
    return toPublicService(deleted);
  }
}