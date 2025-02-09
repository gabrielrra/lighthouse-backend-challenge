import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './assets/swagger.json';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

const app = express();

app.use(express.json());


app.use("/api", routes);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

export default app;
