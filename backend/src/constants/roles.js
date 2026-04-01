export const ROLES = Object.freeze({
  USER: 'USER',
  VENDOR: 'VENDOR',
  ADMIN: 'ADMIN',
});

export const ORDER_STATUS = Object.freeze({
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
});

export const PAYMENT_STATUS = Object.freeze({
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
});
