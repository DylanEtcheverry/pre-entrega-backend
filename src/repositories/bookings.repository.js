export default class BookingsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll() {
    return this.dao.getAll();
  }

  create(booking) {
    return this.dao.create(booking);
  }

  getById(id) {
    return this.dao.getById(id);
  }

  update(id, booking) {
    return this.dao.update(id, booking);
  }
}