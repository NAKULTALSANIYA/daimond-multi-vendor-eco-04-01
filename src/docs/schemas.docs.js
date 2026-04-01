/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         phone:
 *           type: string
 *           example: "9876543210"
 *         role:
 *           type: string
 *           enum: [USER, VENDOR, ADMIN]
 *           example: "USER"
 *         avatarUrl:
 *           type: string
 *           example: "https://example.com/avatar.jpg"
 *         isBlocked:
 *           type: boolean
 *           example: false
 *         lastLoginAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         vendor:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         category:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *         name:
 *           type: string
 *           example: "Gaming Laptop"
 *         slug:
 *           type: string
 *           example: "gaming-laptop"
 *         description:
 *           type: string
 *           example: "High-performance gaming laptop with RTX 4060"
 *         price:
 *           type: number
 *           example: 1200
 *         discountPrice:
 *           type: number
 *           example: 999
 *         sku:
 *           type: string
 *           example: "SKU123456"
 *         stock:
 *           type: integer
 *           example: 10
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               publicId:
 *                 type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["gaming", "laptop", "electronics"]
 *         averageRating:
 *           type: number
 *           example: 4.5
 *         totalReviews:
 *           type: integer
 *           example: 25
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     Vendor:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         user:
 *           type: string
 *           example: "507f1f77bcf86cd799439010"
 *         storeName:
 *           type: string
 *           example: "Tech Store"
 *         businessEmail:
 *           type: string
 *           example: "business@techstore.com"
 *         businessPhone:
 *           type: string
 *           example: "9876543210"
 *         address:
 *           type: string
 *           example: "123 Business St, City"
 *         commissionRate:
 *           type: number
 *           example: 10
 *         approvalStatus:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *           example: "APPROVED"
 *         totalSales:
 *           type: number
 *           example: 5000
 *         totalOrders:
 *           type: integer
 *           example: 50
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *         totalPrice:
 *           type: number
 *         status:
 *           type: string
 *           enum: [PLACED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED]
 *         shippingAddress:
 *           type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     Error:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: "Validation error"
 *         success:
 *           type: boolean
 *           example: false
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         success:
 *           type: boolean
 *           example: true
 */

export const schemas = {};
