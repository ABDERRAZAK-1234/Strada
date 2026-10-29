const { asClass, asFunction } = require('awilix');
const BoardingRepository = require('./boarding.repository');
const BoardingService = require('./boarding.service');
const createBoardingController = require('./boarding.controller');
const createBoardingRouter = require('./boarding.routes');

function registerBoardingModule(container) {
  container.register({
    boardingRepository: asClass(BoardingRepository).singleton(),
    boardingService: asClass(BoardingService).singleton(),
    boardingController: asFunction(createBoardingController).singleton(),
  });
}

module.exports = { registerBoardingModule, createBoardingRouter };
