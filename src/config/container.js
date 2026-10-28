
import express from 'express';
import { createContainer, asClass, asValue } from 'awilix';

import { env } from './env.js';
import { DatabaseConnection } from './db.js';
import { App } from '../app.js';
import { Server } from '../server.js';

const container = createContainer();

container.register({
  mongoUri: asValue(env.mongoUri),
  port: asValue(env.port),

  apiRouter: asValue(express.Router()),

  databaseConnection: asClass(DatabaseConnection).singleton(),
  app: asClass(App).singleton(),
  server: asClass(Server).singleton()
});

export default container;
