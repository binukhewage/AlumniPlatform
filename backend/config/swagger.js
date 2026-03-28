import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Alumni Influencer Platform API",
        version: "1.0.0",
        description: "API documentation for the Alumni Influencer platform",
      },
      servers: [
        {
          url: "http://localhost:8080/api",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "x-api-key"
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["./routes/*.js"],
  };

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };