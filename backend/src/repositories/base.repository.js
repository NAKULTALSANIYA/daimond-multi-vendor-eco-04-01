export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(payload) {
    return this.model.create(payload);
  }

  findById(id, projection = null, options = {}) {
    return this.model.findById(id, projection, options);
  }

  findOne(filter, projection = null, options = {}) {
    return this.model.findOne(filter, projection, options);
  }

  findMany(filter = {}, options = {}) {
    const query = this.model.find(filter);
    if (options.sort) query.sort(options.sort);
    if (options.skip !== undefined) query.skip(options.skip);
    if (options.limit !== undefined) query.limit(options.limit);
    if (options.populate) query.populate(options.populate);
    return query;
  }

  updateOne(filter, update, options = {}) {
    return this.model.findOneAndUpdate(filter, update, { new: true, ...options });
  }
}
