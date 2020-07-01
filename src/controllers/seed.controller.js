/**
 * Seed controller for fill your db of fake data
 */

import HTTPStatus from 'http-status';

import Pilot from '../models/pilot.model';
import Booking from '../models/booking.model';
import { pilotSeed, deletePilotSeed } from '../seeds/pilot.seed';

export async function seedPilots(req, res, next) {
  try {
    await pilotSeed(req.params.count);

    return res
      .status(HTTPStatus.OK)
      .send(`Pilot seed success! Created ${req.params.count || 10} pilots!`);
  } catch (e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  }
}

export async function clearSeedPilots(req, res, next) {
  try {
    await deletePilotSeed();

    return res.status(HTTPStatus.OK).send('Pilot collection empty');
  } catch (e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  }
}


export async function clearAll(req, res, next) {
  try {
    await Promise.all([Pilot.remove(), Booking.remove()]);

    return res.status(HTTPStatus.OK).send('All collections clear');
  } catch (e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  }
}
