const { asClass } = require('awilix');

const LineService = require('./services/line.service');
const CoachService = require('./services/coach.service');
const DepartureService = require('./services/departure.service');
const LineController = require('./controllers/line.controller');
const CoachController = require('./controllers/coach.controller');
const DepartureController = require('./controllers/departure.controller');

let departureServiceRef = null;

function register(container) {
  container.register({
    lineService: asClass(LineService).singleton(),
    coachService: asClass(CoachService).singleton(),
    departureService: asClass(DepartureService).singleton(),
    lineController: asClass(LineController).singleton(),
    coachController: asClass(CoachController).singleton(),
    departureController: asClass(DepartureController).singleton()
  });
}

function bindServices(container) {
  departureServiceRef = container.resolve('departureService');
}

async function getDeparture(id, session = null) {
  return departureServiceRef.getDeparture(id, session);
}

async function guardDeparture(id, expectedStatus, session = null) {
  return departureServiceRef.guardDeparture(id, expectedStatus, session);
}

async function markCancelled(id, session = null) {
  return departureServiceRef.markCancelled(id, session);
}

module.exports = {
  register,
  bindServices,
  getDeparture,
  guardDeparture,
  markCancelled
};