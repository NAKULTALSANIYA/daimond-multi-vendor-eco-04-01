/**
 * @swagger
 * tags:
 *   - name: Uploads
 *     description: Image upload management APIs
 *
 * /uploads/single:
 *   post:
 *     summary: Upload single product image
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg, png, webp, max 5MB)
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Image uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "/uploads/vendors/507f1f77bcf86cd799439011/products/1711402800000-a4c8f2e1.jpg"
 *                     filename:
 *                       type: string
 *                       example: "1711402800000-a4c8f2e1.jpg"
 *                     originalName:
 *                       type: string
 *                       example: "product.jpg"
 *       400:
 *         description: No file provided
 *       413:
 *         description: File size exceeds 5MB limit
 *       415:
 *         description: Invalid file type
 *       401:
 *         description: Unauthorized
 *
 * /uploads/multiple:
 *   post:
 *     summary: Upload multiple product images (max 5)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *     responses:
 *       201:
 *         description: Images uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Images uploaded"
 *                 data:
 *                   type: object
 *                   properties:
 *                     uploaded:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           url:
 *                             type: string
 *                           filename:
 *                             type: string
 *                           originalName:
 *                             type: string
 *                     failed:
 *                       type: array
 *                       items:
 *                         type: object
 *                     totalUploaded:
 *                       type: integer
 *                     totalFailed:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *
 * /uploads/{productId}/{filename}:
 *   delete:
 *     summary: Delete product image
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: filename
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Not authorized to delete this image
 *       401:
 *         description: Unauthorized
 */

export const uploadDocs = {};