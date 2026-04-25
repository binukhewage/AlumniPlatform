//file generates the API Documentation with UI 

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
      openapi: "3.0.0", //open api version 
      info: {
        title: "Alumni Influencer Platform API",  
        version: "1.0.0",
        description: "API documentation for the Alumni Influencer platform",
      },
      //base server URL 
      servers: [
        {
          url: "http://localhost:8080/api",
        },
      ],
      components: {
        //security definitions 
        securitySchemes: {
          //JWT authentication (FOR PROTECTED ROUTES)
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },

          // API AUTH FOR PUBLIC API 
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "x-api-key"
          },
        },
      },
      security: [
        {
          //appplying jwt globally (can override per route if needed)
          bearerAuth: [],
          ApiKeyAuth: [],
        },
      ],
    },

    // path to rote files where api docs are written (ROUTES FOLDER)
    apis: ["./routes/*.js"],
  };

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };