import express from 'express';
import { errorHandler } from './shared/middlewares/errorHandler.js';

export class App {
  constructor({ apiRouter }) {
    this.expressApp = express();
    this.apiRouter = apiRouter;

    this.configure();
  }

  configure() {
    this.expressApp.use(express.json());

    this.expressApp.get('/healthz', (req, res) => {
      res.status(200).json({
        status: 'ok',
        service: 'strada-api'
      });
    });

    this.expressApp.use('/api/v1', this.apiRouter);

    this.expressApp.use(errorHandler);
  }

  getInstance() {
    return this.expressApp;
  }
}