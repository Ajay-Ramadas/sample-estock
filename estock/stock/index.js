import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { swaggerOptions } from './src/config/swagger.config.js';
import { router as StockRouter } from './src/routes/StockRouter.js';
import cors from 'cors';
import actuator from 'express-actuator';
import { actuatorOptions } from './src/config/actuator.config.js';

const app = express();
const PORT = process.env.PORT_STOCK || 8080;

app.use(express.json());
app.use(cors());
app.use(actuator(actuatorOptions))

// Swagger Setup
const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs));

// Routes
app.use("/api/v1.0/market/stock", StockRouter);

app.listen(PORT, () => console.log('App is listening on port:'+PORT));