import { Product } from '../models/Product.js';
import { BaseRepository } from './base.repository.js';

export class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  paginatedSearch(filter, { page, limit, sort }) {
    return Product.paginate(filter, {
      page,
      limit,
      sort,
      populate: [
        { path: 'category', select: 'name slug' },
        { path: 'vendor', select: 'storeName approvalStatus' },
      ],
      lean: true,
    });
  }
}

export const productRepository = new ProductRepository();
