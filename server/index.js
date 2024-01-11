const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const cookie = require("cookie-parser");

const app = express();
const dbs = require("./config/dbs");
const router = require("./routers/router");

const swaggerUi = require("swagger-ui-express");
const swaggerSetup = require("./Utils/swaggerSetup");
const SwaggerDocument = require("./swagger.json");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
app.use(cookie());

app.use("/", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(SwaggerDocument));
dbs;

app.listen(8000, () => {
  console.log("Port running on 8000");
});
