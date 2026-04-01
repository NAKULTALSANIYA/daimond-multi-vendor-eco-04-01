import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

export class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price stock images');
    if (!cart) cart = await Cart.create({ user: userId, items: [] });
    return cart;
  }

  async addToCart(userId, productId, quantity) {
    const product = await Product.findById(productId).populate('vendor');
    if (!product || !product.isActive || product.isDeleted) throw new ApiError(404, 'Product unavailable');
    if (product.stock < quantity) throw new ApiError(400, 'Insufficient stock');

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });

    const index = cart.items.findIndex((item) => item.product.toString() === productId);
    if (index > -1) {
      cart.items[index].quantity += quantity;
      cart.items[index].unitPrice = product.effectivePrice;
    } else {
      cart.items.push({
        product: product._id,
        vendor: product.vendor,
        quantity,
        unitPrice: product.effectivePrice,
      });
    }

    await cart.save();
    return cart;
  }

  async removeFromCart(userId, productId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError(404, 'Cart not found');
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    return cart;
  }

  async clearCart(userId) {
    await Cart.findOneAndUpdate({ user: userId }, { items: [] }, { upsert: true });
  }
}

export const cartService = new CartService();
