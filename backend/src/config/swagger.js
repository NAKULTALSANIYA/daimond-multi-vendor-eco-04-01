import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const definition = {
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
};

const options = {
  definition,
  apis: [
    path.join(__dirname, '../docs/**/*.docs.js'),
  ],
};

const baseSwaggerSpec = swaggerJSDoc(options);

const normalizeApiPrefix = (prefix) => {
  if (!prefix) return '/api';
  return prefix.startsWith('/') ? prefix : `/${prefix}`;
};

const getSpecForRequest = (req) => {
  const apiPrefix = normalizeApiPrefix(env.apiPrefix);
  const host = req.get('host') || `localhost:${env.port}`;
  const protocol = req.protocol || 'http';
  const runtimeServer = `${protocol}://${host}${apiPrefix}`;

  return {
    ...baseSwaggerSpec,
    servers: [
      {
        url: runtimeServer,
        description: 'Current environment server',
      },
    ],
  };
};

export const setupSwagger = (app) => {
  const apiPrefix = normalizeApiPrefix(env.apiPrefix);
  const docsPath = `${apiPrefix}/docs`;
  const jsonPath = '/api-docs.json';
  const prefixedJsonPath = `${docsPath}.json`;

  app.get(jsonPath, (req, res) => {
    res.json(getSpecForRequest(req));
  });

  app.get(prefixedJsonPath, (req, res) => {
    res.json(getSpecForRequest(req));
  });

  const swaggerUiOptions = {
    swaggerOptions: {
      url: jsonPath,
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
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, swaggerUiOptions));

  app.use(
    docsPath,
    swaggerUi.serve,
    swaggerUi.setup(null, {
      ...swaggerUiOptions,
      swaggerOptions: {
        ...swaggerUiOptions.swaggerOptions,
        url: prefixedJsonPath,
      },
    })
  );
};
