import { Category } from '../models/Category.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Vendor } from '../models/Vendor.js';
import { ApiError } from '../utils/ApiError.js';
import { buildPagination } from '../utils/query.js';

export class AdminService {
  async platformOverview() {
    const [users, vendors, products, orders, paidRevenue] = await Promise.all([
      User.countDocuments({ role: 'USER', isDeleted: false }),
      Vendor.countDocuments({ isDeleted: false }),
      Product.countDocuments({ isDeleted: false }),
      Order.countDocuments({ isDeleted: false }),
      Order.aggregate([
        { $match: { paymentStatus: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    return {
      users,
      vendors,
      products,
      orders,
      totalRevenue: paidRevenue[0]?.total || 0,
    };
  }

  async listUsers(query) {
    const { page, limit, sort } = buildPagination(query);
    return User.paginate({}, { page, limit, sort, select: '-password' });
  }

  async listVendors(query) {
    const { page, limit, sort } = buildPagination(query);
    return Vendor.paginate({}, { page, limit, sort, populate: [{ path: 'user', select: 'name email role' }] });
  }

  async listProducts(query) {
    const { page, limit, sort } = buildPagination(query);
    return Product.paginate({}, { page, limit, sort, populate: ['vendor', 'category'] });
  }

  async listOrders(query) {
    const { page, limit, sort } = buildPagination(query);
    return Order.paginate({}, { page, limit, sort, populate: ['user', 'address'] });
  }

  async approveVendor(vendorId, adminUserId, decision) {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) throw new ApiError(404, 'Vendor not found');

    vendor.approvalStatus = decision;
    vendor.approvedBy = adminUserId;
    vendor.approvedAt = new Date();
    await vendor.save();
    return vendor;
  }

  async blockUser(userId, isBlocked) {
    const user = await User.findByIdAndUpdate(userId, { isBlocked }, { new: true });
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  }

  async blockVendor(vendorId, isBlocked) {
    const vendor = await Vendor.findByIdAndUpdate(vendorId, { isBlocked }, { new: true });
    if (!vendor) throw new ApiError(404, 'Vendor not found');
    return vendor;
  }

  async createCategory(payload) {
    return Category.create(payload);
  }

  async listCategories(query) {
    const { page, limit, sort } = buildPagination(query);
    return Category.paginate({}, { page, limit, sort });
  }

  async updateCategory(categoryId, payload) {
    const category = await Category.findByIdAndUpdate(categoryId, payload, { new: true });
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
  }

  async deleteCategory(categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) throw new ApiError(404, 'Category not found');
    await category.softDelete();
  }

  async updateCommission(vendorId, commissionRate) {
    const vendor = await Vendor.findByIdAndUpdate(vendorId, { commissionRate }, { new: true });
    if (!vendor) throw new ApiError(404, 'Vendor not found');
    return vendor;
  }
}

export const adminService = new AdminService();
