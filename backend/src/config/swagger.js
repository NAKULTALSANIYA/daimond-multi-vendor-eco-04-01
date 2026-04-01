import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi Vendor Ecommerce API',
      version: '1.0.0',
      description: 'Production-grade backend APIs for multi-vendor ecommerce platform with user, vendor, and admin roles',
      contact: {
        name: 'API Support',
        email: 'support@multivendor.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local development server',
      },
      {
        url: 'https://api.example.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token for authentication',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: {
                    type: 'integer',
                    example: 401,
                  },
                  message: {
                    type: 'string',
                    example: 'Unauthorized',
                  },
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                },
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Access forbidden',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: {
                    type: 'integer',
                    example: 403,
                  },
                  message: {
                    type: 'string',
                    example: 'Forbidden',
                  },
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: {
                    type: 'integer',
                    example: 404,
                  },
                  message: {
                    type: 'string',
                    example: 'Not Found',
                  },
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: {
                    type: 'integer',
                    example: 400,
                  },
                  message: {
                    type: 'string',
                    example: 'Validation failed',
                  },
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication & Authorization',
      },
      {
        name: 'Products',
        description: 'Product management & search',
      },
      {
        name: 'Uploads',
        description: 'Image uploads',
      },
      {
        name: 'Vendors',
        description: 'Vendor management',
      },
      {
        name: 'Users',
        description: 'User profile & settings',
      },
      {
        name: 'Cart',
        description: 'Shopping cart',
      },
      {
        name: 'Orders',
        description: 'Orders & payments',
      },
      {
        name: 'Admin',
        description: 'Admin panel & controls',
      },
    ],
  },
  apis: [
    './src/docs/schemas.docs.js',
    './src/docs/auth.docs.js',
    './src/docs/product.docs.js',
    './src/docs/upload.docs.js',
    './src/docs/vendor.docs.js',
    './src/docs/user.docs.js',
    './src/docs/cart.docs.js',
    './src/docs/order.docs.js',
    './src/docs/admin.docs.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      filter: true,
      showRequestHeaders: true,
      defaultModelsExpandDepth: 1,
      docExpansion: 'list',
    },
    customCss: `
      .swagger-ui .topbar {
        background-color: #1a1a1a;
      }
      .topbar-wrapper a span {
        color: #4CAF50 !important;
      }
      .info .title {
        color: #4CAF50;
      }
    `,
  }));
};
