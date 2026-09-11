export default class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  validateServiceData(serviceData) {
    const requiredFields = [
      'name',
      'description',
      'duration',
      'price',
      'category',
      'available',
    ];

    const missingFields = requiredFields.filter(
      (field) => serviceData[field] === undefined || serviceData[field] === null
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  async getServices(filters = {}) {
    const {
      category,
      available,
      page = 1,
      limit = 10,
      sortBy,
      order = 'asc',
    } = filters;
    const result = await this.repository.getAll({
      category,
      available,
      page,
      limit,
      sortBy,
      order,
    });
    const totalPages = Math.ceil(result.total / limit);

    return {
      services: result.services,
      total: result.total,
      page,
      limit,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  getServiceById(id) {
    return this.repository.getById(id);
  }

  async createService(serviceData) {
    if (typeof serviceData !== 'object' || serviceData === null) {
      throw new Error('Service data must be an object');
    }

    if ('id' in serviceData) {
      throw new Error('Do not include id in request body');
    }

    this.validateServiceData(serviceData);
    return this.repository.create({ ...serviceData });
  }

  async updateService(id, updatedData) {
    if (typeof updatedData !== 'object' || updatedData === null) {
      throw new Error('Updated data must be an object');
    }

    if ('id' in updatedData && updatedData.id !== id) {
      throw new Error('Cannot modify the id field');
    }

    const currentService = await this.repository.getById(id);
    if (!currentService) return null;

    const { _id, ...currentData } = currentService;
    return this.repository.update(id, { ...currentData, ...updatedData });
  }

  deleteService(id) {
    return this.repository.delete(id);
  }
}