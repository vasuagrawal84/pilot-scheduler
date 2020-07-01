import { Router } from 'express';
import HTTPStatus from 'http-status';

import PilotRoutes from './pilot.routes';
import BookingRoutes from './booking.routes';
import SeedRoutes from './seed.routes';

import APIError from '../services/error';

// Middlewares go here
import logErrorService from '../services/log';

const routes = new Router();

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

routes.use('/pilot', PilotRoutes);
routes.use('/booking', BookingRoutes);

routes.use('/seeds', SeedRoutes);

routes.all('*', (req, res, next) =>
  next(new APIError('Not Found!', HTTPStatus.NOT_FOUND, true)),
);

routes.use(logErrorService);

export default routes;
