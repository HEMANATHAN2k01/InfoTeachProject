const swaggerJSDoc = require("swagger-jsdoc");

const option = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "InfoTech pro to Swagger",
      version:'1.0.0'
    },
    servers: [
      {
        url: "http://localhost:8000/",
      },
    ],
  },
  apis: ["./swaggerSetup.js"],
};
const swaggerOption = swaggerJSDoc(option);

module.exports = swaggerOption;

