import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Vendor } from '../models/Vendor.js';
import { productRepository } from '../repositories/product.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { buildPagination, buildSearchRegex } from '../utils/query.js';

export class ProductService {
  normalizeSlug(value) {
    if (!value) return '';
    return String(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }

  async ensureUniqueSlug(baseSlug) {
    if (!baseSlug) return '';

    let candidate = baseSlug;
    let attempt = 1;

    while (await Product.exists({ slug: candidate })) {
      candidate = `${baseSlug}-${attempt}`;
      attempt += 1;
    }

    return candidate;
  }

  async searchProducts(query) {
    const { page, limit, sort } = buildPagination(query);
    const filter = { isActive: true };

    if (query.q) {
      filter.$text = { $search: query.q };
    }

    if (query.category) {
      const category = await Category.findOne({ slug: query.category });
      if (category) filter.category = category._id;
    }

    if (query.vendor) {
      const vendor = await Vendor.findOne({ storeName: buildSearchRegex(query.vendor), approvalStatus: 'APPROVED' });
      if (vendor) filter.vendor = vendor._id;
    }

    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    return productRepository.paginatedSearch(filter, { page, limit, sort });
  }

  async vendorProducts(vendorId, query) {
    const { page, limit, sort } = buildPagination(query);
    return Product.paginate(
      { vendor: vendorId },
      {
        page,
        limit,
        sort,
        populate: [{ path: 'category', select: 'name slug' }],
      }
    );
  }

  async createProduct(vendorId, payload) {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor || vendor.approvalStatus !== 'APPROVED') {
      throw new ApiError(403, 'Vendor not approved');
    }

    const baseSlug = this.normalizeSlug(payload.slug || payload.name);
    const slug = await this.ensureUniqueSlug(baseSlug);
    if (!slug) {
      throw new ApiError(400, 'slug is invalid or could not be generated');
    }

    const category = await Category.findById(payload.category);
    if (!category) throw new ApiError(404, 'Category not found');

    const product = await Product.create({ ...payload, slug, vendor: vendorId });
    return product;
  }

  async updateProduct(vendorId, productId, payload) {
    const product = await Product.findOne({ _id: productId, vendor: vendorId });
    if (!product) throw new ApiError(404, 'Product not found');

    Object.assign(product, payload);
    await product.save();
    return product;
  }

  async deleteProduct(vendorId, productId) {
    const product = await Product.findOne({ _id: productId, vendor: vendorId });
    if (!product) throw new ApiError(404, 'Product not found');
    await product.softDelete();
  }

  async getProductById(productId) {
    const product = await Product.findById(productId);
    return product;
  }
}

export const productService = new ProductService();
