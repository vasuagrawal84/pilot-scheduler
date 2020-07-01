import { Router } from 'express';
import validate from 'express-validation';

import * as PilotController from '../controllers/pilot.controller';

const routes = new Router();

routes.post(
  '/',
  PilotController.create);

routes.get(
  '/availability',
  PilotController.getAvailability,
);

export default routes;
