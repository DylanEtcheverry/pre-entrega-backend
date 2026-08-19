import fs from 'node:fs/promises';

export default class ServiceManager {
  constructor(dataFile) {
    this.dataFile = dataFile;
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

  async getServices() {
    return this.readData();
  }

  async getServiceById(id) {
    const services = await this.readData();
    return services.find((service) => service.id === id) ?? null;
  }

  async addService(serviceData) {
    if (typeof serviceData !== 'object' || serviceData === null) {
      throw new Error('Service data must be an object');
    }

    this.validateServiceData(serviceData);

    const services = await this.readData();
    const id = String(Date.now());
    const newService = { id, ...serviceData };

    services.push(newService);
    await this.writeData(services);

    return newService;
  }

  async updateService(id, updatedData) {
    if (typeof updatedData !== 'object' || updatedData === null) {
      throw new Error('Updated data must be an object');
    }

    if ('id' in updatedData && updatedData.id !== id) {
      throw new Error('Cannot modify the id field');
    }

    const services = await this.readData();
    const index = services.findIndex((service) => service.id === id);
    if (index === -1) return null;

    services[index] = { ...services[index], ...updatedData, id };
    await this.writeData(services);
    return services[index];
  }

  async deleteService(id) {
    const services = await this.readData();
    const index = services.findIndex((service) => service.id === id);
    if (index === -1) return null;

    const [deleted] = services.splice(index, 1);
    await this.writeData(services);
    return deleted;
  }
}
