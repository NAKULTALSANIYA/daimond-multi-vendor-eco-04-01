import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Vendor } from '../models/Vendor.js';
import { ApiError } from '../utils/ApiError.js';
import { buildPagination, buildSearchRegex } from '../utils/query.js';

export class VendorService {
  async searchVendors(query) {
    const { page, limit, sort } = buildPagination(query);
    const filter = { approvalStatus: 'APPROVED' };

    if (query.q) {
      filter.storeName = buildSearchRegex(query.q);
    }

    return Vendor.paginate(filter, {
      page,
      limit,
      sort,
      populate: [{ path: 'user', select: 'name email' }],
    });
  }

  async getByUserId(userId) {
    const vendor = await Vendor.findOne({ user: userId });
    if (!vendor) throw new ApiError(404, 'Vendor profile not found');
    return vendor;
  }

  async updateProfile(userId, payload) {
    const vendor = await this.getByUserId(userId);
    Object.assign(vendor, payload);
    await vendor.save();
    return vendor;
  }

  async dashboard(userId) {
    const vendor = await this.getByUserId(userId);

    const [totalProducts, productInStock, orderStats] = await Promise.all([
      Product.countDocuments({ vendor: vendor._id, isDeleted: false }),
      Product.countDocuments({ vendor: vendor._id, stock: { $gt: 0 }, isDeleted: false }),
      Order.aggregate([
        { $match: { 'items.vendor': vendor._id } },
        { $unwind: '$items' },
        { $match: { 'items.vendor': vendor._id } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$items.totalPrice' },
            totalOrders: { $addToSet: '$_id' },
          },
        },
      ]),
    ]);

    const totalRevenue = orderStats[0]?.totalRevenue || 0;
    const totalOrders = orderStats[0]?.totalOrders?.length || 0;

    return {
      vendor,
      stats: {
        totalProducts,
        productInStock,
        totalRevenue,
        totalOrders,
      },
    };
  }

  async salesAnalytics(userId) {
    const vendor = await this.getByUserId(userId);
    const analytics = await Order.aggregate([
      { $match: { 'items.vendor': vendor._id, paymentStatus: 'PAID' } },
      { $unwind: '$items' },
      { $match: { 'items.vendor': vendor._id } },
      {
        $facet: {
          daily: [
            {
              $group: {
                _id: {
                  y: { $year: '$createdAt' },
                  m: { $month: '$createdAt' },
                  d: { $dayOfMonth: '$createdAt' },
                },
                revenue: { $sum: '$items.totalPrice' },
              },
            },
            { $sort: { '_id.y': -1, '_id.m': -1, '_id.d': -1 } },
            { $limit: 30 },
          ],
          monthly: [
            {
              $group: {
                _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
                revenue: { $sum: '$items.totalPrice' },
              },
            },
            { $sort: { '_id.y': -1, '_id.m': -1 } },
            { $limit: 12 },
          ],
        },
      },
    ]);

    return analytics[0] || { daily: [], monthly: [] };
  }
}

export const vendorService = new VendorService();
