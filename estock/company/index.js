import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { swaggerOptions } from './src/config/swagger.config.js';
import { router as CompanyRouter } from './src/routes/CompanyRoutes.js';
import cors from 'cors';
import actuator from 'express-actuator';
import { actuatorOptions } from './src/config/actuator.config.js';

const app = express();
const PORT = process.env.PORT_COMPANY || 5080;

app.use(express.json());
app.use(cors());
app.use(actuator(actuatorOptions))

// Swagger Setup
const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs));

// Routes
app.use("/api/v1.0/market/company", CompanyRouter);

app.listen(PORT, () => console.log('App is listening on port:'+PORT));