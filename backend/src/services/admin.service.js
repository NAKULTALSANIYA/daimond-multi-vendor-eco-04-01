import { Category } from '../models/Category.js';
import { PAYMENT_STATUS, ROLES } from '../constants/roles.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Vendor } from '../models/Vendor.js';
import { ApiError } from '../utils/ApiError.js';
import { buildPagination } from '../utils/query.js';

export class AdminService {
  async getVendorUserIds() {
    return User.distinct('_id', { role: ROLES.VENDOR, isDeleted: false });
  }

  async platformOverview() {
    const vendorUserIds = await this.getVendorUserIds();

    const [totalUsers, totalVendors, activeVendors, pendingVendors, totalProducts, totalOrders, paidRevenue] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      Vendor.countDocuments({ user: { $in: vendorUserIds }, isDeleted: false }),
      Vendor.countDocuments({ user: { $in: vendorUserIds }, approvalStatus: 'APPROVED', isDeleted: false }),
      Vendor.countDocuments({ user: { $in: vendorUserIds }, approvalStatus: 'PENDING', isDeleted: false }),
      Product.countDocuments({ isDeleted: false }),
      Order.countDocuments({ isDeleted: false }),
      Order.aggregate([
        { $match: { paymentStatus: PAYMENT_STATUS.PAID, isDeleted: false } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const totalRevenue = paidRevenue[0]?.total || 0;

    return {
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      activeVendors,
      pendingVendors,
      totalRevenue,
      // Backward-compatible keys for existing clients.
      users: totalUsers,
      vendors: totalVendors,
      products: totalProducts,
      orders: totalOrders,
    };
  }

  async listUsers(query) {
    const { page, limit, sort } = buildPagination(query);
    return User.paginate({}, { page, limit, sort, select: '-password' });
  }

  async listVendors(query) {
    const { page, limit, sort } = buildPagination(query);
    const vendorUserIds = await this.getVendorUserIds();
    return Vendor.paginate(
      { user: { $in: vendorUserIds } },
      { page, limit, sort, populate: [{ path: 'user', select: 'name email role' }] }
    );
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
