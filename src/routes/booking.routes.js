import { Router } from 'express';

import * as BookingController from '../controllers/booking.controller';

const routes = new Router();

routes.post(
  '/',
  BookingController.create,
);

export default routes;
