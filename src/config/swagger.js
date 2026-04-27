import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Content Broadcasting API',

      version: '1.0.0',

      description:
        'Backend API for content broadcasting system',
    },

    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',

          scheme: 'bearer',

          bearerFormat: 'JWT',
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;