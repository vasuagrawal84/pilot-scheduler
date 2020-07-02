import HTTPStatus from 'http-status';
import moment from 'moment';

import Booking from '../models/booking.model';
import Pilot from '../models/pilot.model';

/**
 * @api {post} /booking Create booking
 * @apiDescription Create a new flight booking for a pilot and given time
 * @apiName createBooking
 * @apiGroup Booking
 * 
 * @apiParam (Request body) {Number} pilotId ID of the pilot (not the databaseId)
 * @apiParam (Request body) {Date} depDateTime departure time of flight
 * @apiParam (Request body) {Date} returnDateTime return time to base
 *
 * @apiSuccess {Number} status Status of the Request.
 * @apiSuccess {String} booking._id Booking _id.
 * @apiSuccess {String} booking.depDateTime Booking depDateTime.
 * @apiSuccess {String} booking.returnDateTime Booking returnDateTime.
 * @apiSuccess {String} booking.createdAt Booking created date.
 *
 * @apiSuccessExample Success-Response:
 *
 * HTTP/1.1 200 OK
 *
 * {
 *    "_id": "5efe49f09cb6e3eb25444743",
 *    "depDateTime": 1653811200,
 *    "returnDateTime": 1653822000,
 *    "createdAt": "2020-07-02T20:56:16.040Z"
 * }
 *
 * @apiErrorExample {json} Endpoint not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Unauthorized
 *    HTTP/1.1 400 Pilot is not available at the given time
 */
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
