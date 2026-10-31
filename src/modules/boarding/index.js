import { asClass, asFunction } from'awilix';
import BoardingRepository from'./boarding.repository';
import BoardingService from'./boarding.service';
import createBoardingController from'./boarding.controller';
import createBoardingRouter from './boarding.routes';

function registerBoardingModule(container) {
  container.register({
    boardingRepository: asClass(BoardingRepository).singleton(),
    boardingService: asClass(BoardingService).singleton(),
    boardingController: asFunction(createBoardingController).singleton(),
  });
}

export  { registerBoardingModule, createBoardingRouter };
