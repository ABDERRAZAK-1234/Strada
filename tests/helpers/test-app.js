import request from'supertest';
import { asValue }from 'awilix';
import { createApp }from '../../src/app.js';
import { seedAll } from'../../scripts/seed';
import { connectTestDb, disconnectTestDb } from'./test-db';
import { loginAll } from'./auth-helpers';

function buildTestApp(overrides = {}) {
  const { app } = createApp({ overrides });
  return { api: request(app) };
}

function fake(value) {
  return asValue(value);
}

async function startTestEnvironment(overrides = {}) {
  const { api } = buildTestApp(overrides);
  await connectTestDb();
  await seedAll();
  const tokens = await loginAll(api);

  return { api, tokens };
}

async function stopTestEnvironment() {
  await disconnectTestDb();
}

export { buildTestApp, fake, startTestEnvironment, stopTestEnvironment };
