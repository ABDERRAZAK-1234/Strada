const request = require('supertest');
const { asValue } = require('awilix');
const { createApp } = require('../../src/app');
const { seedAll } = require('../../scripts/seed');
const { connectTestDb, disconnectTestDb } = require('./test-db');
const { loginAll } = require('./auth-helpers');

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

module.exports = { buildTestApp, fake, startTestEnvironment, stopTestEnvironment };
