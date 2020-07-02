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
    const isAlreadyBooked = await Booking.isAlreadyBooked(pilot, departTimestamp, returnTimestamp);

    const weekdayOfFlight = moment(depDateTime).format('dddd');
    const isPilotWorking = pilot.WorkDays.includes(weekdayOfFlight);

    if (isAlreadyBooked || !isPilotWorking) {
      throw new Error('Pilot is not available at the given time');
    }

    return res
      .status(HTTPStatus.CREATED)
      .json(await Booking.createBooking(pilot, departTimestamp, returnTimestamp));
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
