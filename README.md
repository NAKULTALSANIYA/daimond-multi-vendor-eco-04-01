# Multi-Vendor Ecommerce Backend

Production-ready backend architecture for a multi-vendor ecommerce platform built with Node.js, Express.js, MongoDB (Mongoose), and ES modules.

## Tech Stack

- Node.js 20+ (LTS)
- Express.js
- MongoDB + Mongoose
- Zod validation
- JWT auth with refresh token rotation
- Razorpay (with mock fallback)
- Winston logging
- Swagger docs
- Jest + Supertest

## Folder Structure

```text
.
├── src
│   ├── app.js
│   ├── server.js
│   ├── config
│   ├── constants
│   ├── controllers
│   ├── docs
│   ├── middlewares
│   ├── models
│   │   └── plugins
│   ├── repositories
│   ├── routes
│   ├── services
│   ├── utils
│   └── validators
├── tests
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

## Core Features

### User

- Register/Login with JWT + refresh tokens
- Product/vendor search with filters + pagination
- Cart APIs
- Place orders
- Payment initiation + verification
- Wishlist management
- Address management
- Order history

### Vendor

- Vendor profile management
- Product CRUD + image upload
- Inventory tracking
- Vendor dashboard and sales analytics
- Vendor order management

### Admin

- Manage users, vendors, products, orders
- Approve/reject vendors
- Block/unblock users/vendors
- Category management (create/list/update/delete)
- Commission management
- Platform analytics

## Security

- Helmet
- CORS controls
- Rate limiting
- NoSQL injection sanitization
- HPP protection
- bcrypt password hashing
- JWT access/refresh auth
- RBAC middleware
- Centralized error handling

## Environment Setup

1. Copy env template:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Run tests:

```bash
npm test
```

## API Base Paths

- Health: `GET /health`
- API V1: `/api/v1`
- Swagger UI: `/api-docs`

## Sample Endpoints

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

### Public Discovery

- `GET /api/v1/products?q=phone&page=1&limit=10`
- `GET /api/v1/vendors?q=electronics&page=1&limit=10`

### User

- `GET /api/v1/users/profile`
- `GET /api/v1/users/addresses`
- `POST /api/v1/users/addresses`
- `PATCH /api/v1/users/wishlist/:productId`
- `GET /api/v1/cart`
- `POST /api/v1/cart`
- `DELETE /api/v1/cart/:productId`
- `POST /api/v1/orders`
- `GET /api/v1/orders/my-orders`
- `POST /api/v1/orders/:orderId/payment`

### Vendor

- `GET /api/v1/vendors/me`
- `PATCH /api/v1/vendors/me`
- `GET /api/v1/vendors/dashboard`
- `GET /api/v1/vendors/analytics`
- `GET /api/v1/products/vendor/my-products`
- `POST /api/v1/products/vendor`
- `PATCH /api/v1/products/vendor/:productId`
- `DELETE /api/v1/products/vendor/:productId`
- `GET /api/v1/orders/vendor`
- `PATCH /api/v1/orders/vendor/:orderId/status`

### Admin

- `GET /api/v1/admin/overview`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/vendors`
- `PATCH /api/v1/admin/vendors/:vendorId/decision`
- `PATCH /api/v1/admin/users/:userId/block`
- `PATCH /api/v1/admin/vendors/:vendorId/block`
- `GET /api/v1/admin/categories`
- `POST /api/v1/admin/categories`
- `PATCH /api/v1/admin/categories/:categoryId`
- `DELETE /api/v1/admin/categories/:categoryId`
- `PATCH /api/v1/admin/vendors/:vendorId/commission`

## Docker (Optional)

```bash
docker compose up --build
```

## Production Notes

- Replace JWT secrets and enable strict CORS origin values.
- Use managed MongoDB + Redis in production.
- Add CI lint/test gates and secret scanning.
- Add webhook signature validation endpoint for Razorpay callbacks.
- Enable centralized observability (OpenTelemetry + metrics) for enterprise workloads.
