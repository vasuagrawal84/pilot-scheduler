import { Router } from 'express';

import * as SeedController from '../controllers/seed.controller';

const routes = new Router();

routes.get('/clear', SeedController.clearAll);
routes.get('/pilots/clear', SeedController.clearSeedPilots);
routes.get('/pilots/:count?', SeedController.seedPilots);

export default routes;
