import express from 'express';

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
  }

  getInstance() {
    return this.expressApp;
  }
}
