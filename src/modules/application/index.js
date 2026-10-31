const { asClass, asFunction } = require('awilix');
const CancelDepartureService = require('./cancel-departure.service');
const SeatViewService = require('./seat-view.service');
const createApplicationController = require('./application.controller');
const createApplicationRouter = require('./application.routes');


function registerApplicationServices(container) {
  container.register({
    cancelDepartureService: asClass(CancelDepartureService).singleton(),
    seatViewService: asClass(SeatViewService).singleton(),
    applicationController: asFunction(createApplicationController).singleton(),
  });
}

module.exports = { registerApplicationServices, createApplicationRouter };