/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product management & search APIs
 *
 * /products:
 *   get:
 *     summary: Search products with filters and pagination
 *     tags: [Products]
 *     parameters:
 *       - name: q
 *         in: query
 *         description: Search query string
 *         schema:
 *           type: string
 *           example: "laptop"
 *       - name: category
 *         in: query
 *         description: Category slug
 *         schema:
 *           type: string
 *           example: "electronics"
 *       - name: vendor
 *         in: query
 *         description: Vendor name
 *         schema:
 *           type: string
 *           example: "Tech Store"
 *       - name: minPrice
 *         in: query
 *         schema:
 *           type: number
 *           example: 100
 *       - name: maxPrice
 *         in: query
 *         schema:
 *           type: number
 *           example: 2000
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
 *       - name: sort
 *         in: query
 *         description: Sort field and direction
 *         schema:
 *           type: string
 *           example: "-price"
 *     responses:
 *       200:
 *         description: Products fetched successfully
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
 *                   example: "Products fetched"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalDocs:
 *                       type: integer
 *       400:
 *         description: Invalid query parameters
 *
 * /products/vendor/my-products:
 *   get:
 *     summary: Get vendor's products
 *     tags: [Products]
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
 *     responses:
 *       200:
 *         description: Vendor products fetched
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only vendors can access
 *
 * /products/vendor:
 *   post:
 *     summary: Create new product (vendor only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *               - description
 *               - sku
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 180
 *               price:
 *                 type: number
 *                 minimum: 0
 *               discountPrice:
 *                 type: number
 *                 minimum: 0
 *               category:
 *                 type: string
 *                 description: Category ID
 *               description:
 *                 type: string
 *                 maxLength: 3000
 *               sku:
 *                 type: string
 *                 minLength: 3
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image (jpeg, png, webp, max 5MB)
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       413:
 *         description: File too large
 *
 * /products/vendor/{productId}:
 *   patch:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 *       403:
 *         description: Not authorized
 *
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */

export const productDocs = {};