import cors from 'cors';
import express, { Express } from 'express';

import config from './config/config.js';
import { errorHandler } from './middleware/errorHandler.js';
import eventRouter from './routes/eventRoutes.js';

const app: Express = express();

app.use(express.json());
app.use(cors());
// app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/api/v1/events', eventRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} ...`);
});
