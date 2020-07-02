import HTTPStatus from 'http-status';
import moment from 'moment';

import Booking from '../models/booking.model';
import Pilot from '../models/pilot.model';

export async function create(req, res, next) {
  try {
    const { pilotId, depDateTime, returnDateTime } = req.body;

    const departTimestamp = moment(depDateTime).unix();
    const returnTimestamp = moment(returnDateTime).unix();

    const pilot = await Pilot.findOne({ ID: pilotId });
    return res
      .status(HTTPStatus.CREATED)
      .json(await Booking.createBooking(pilot, departTimestamp, returnTimestamp));
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
