/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin management & platform control APIs
 *
 * /admin/overview:
 *   get:
 *     summary: Get platform overview metrics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform overview data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     totalVendors:
 *                       type: integer
 *                     totalOrders:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     activeVendors:
 *                       type: integer
 *                     pendingVendors:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *
 * /admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: q
 *         in: query
 *         description: Search by name or email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users list
 *
 * /admin/users/{userId}/block:
 *   patch:
 *     summary: Block/unblock user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isBlocked
 *             properties:
 *               isBlocked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User status updated
 *       404:
 *         description: User not found
 *
 * /admin/vendors:
 *   get:
 *     summary: List all vendors
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Vendors list
 *
 * /admin/vendors/{vendorId}/decision:
 *   patch:
 *     summary: Approve or reject vendor
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: vendorId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vendor decision updated
 *       404:
 *         description: Vendor not found
 *
 * /admin/vendors/{vendorId}/block:
 *   patch:
 *     summary: Block/unblock vendor
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: vendorId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isBlocked
 *             properties:
 *               isBlocked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Vendor status updated
 *
 * /admin/vendors/{vendorId}/commission:
 *   patch:
 *     summary: Update vendor commission rate
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: vendorId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commissionRate
 *             properties:
 *               commissionRate:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Commission updated
 *
 * /admin/products:
 *   get:
 *     summary: List all products
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: vendor
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products list
 *
 * /admin/orders:
 *   get:
 *     summary: List all orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PLACED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Orders list
 *
 * /admin/categories:
 *   get:
 *     summary: List all categories
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories list
 *
 *   post:
 *     summary: Create new category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Electronics"
 *               slug:
 *                 type: string
 *                 example: "electronics"
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 *       409:
 *         description: Category already exists
 *
 * /admin/categories/{categoryId}:
 *   patch:
 *     summary: Update category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 *
 *   delete:
 *     summary: Delete category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */

export const adminDocs = {};