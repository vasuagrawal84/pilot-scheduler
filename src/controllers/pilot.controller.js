import Joi from 'joi';
import HTTPStatus from 'http-status';
import moment from 'moment';

import Pilot from '../models/pilot.model';
import Booking from '../models/booking.model';

export const validation = {
  create: {
    body: {
      ID: Joi.number()
        .required(),
      Name: Joi.string()
        .min(3)
        .required(),
      Base: Joi.string()
        .min(3)
        .required(),
      WorkDays: Joi.array()
        .required(),
    },
  },
};

/**
 * @api {post} /pilot Create a pilot
 * @apiDescription Create a pilot
 * @apiName createPilot
 * @apiGroup Pilot
 *
 * @apiParam {Number} status Status of the Request.
 * @apiParam {String} pilot.ID Pilot ID.
 * @apiParam {String} pilot.Name Pilot name.
 * @apiParam {String} pilot.Base Pilot base.
 * @apiParam {String} pilot.WorkDays Pilot created date.
 * 
 *
 * @apiSuccessExample Success-Response:
 *
 * HTTP/1.1 200 OK
 *
 * @apiErrorExample {json} Endpoint not found
 *    HTTP/1.1 404 Not Found
 */
export const create = async (req, res, next) => {
  try {
    const { ID, Name, Base, WorkDays } = req.body;

    await Pilot.createPilot(ID, Name, Base, WorkDays);
    return res.status(HTTPStatus.CREATED).send();
  } catch (e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  };
}

/**
 * @api {get} /pilot/availability Find a pilot
 * @apiDescription Get an available pilot for a given location and times
 * @apiName findAvailablePilot
 * @apiGroup Pilot
 *
 * @apiParam (query) {String} location
 * @apiParam (query) {Date} depDateTime
 * @apiParam (query) {Date} returnDateTime
 *
 * @apiSuccess {Number} status Status of the Request.
 * @apiSuccess {Object[]} pilot pilot info
 * @apiSuccess {String} pilot.WorkDays Pilot WorkDays.
 * @apiSuccess {String} pilot.Bookings Pilot Bookings.
 * @apiSuccess {String} pilot._id Pilot database _id.
 * @apiSuccess {Object} pilot.ID Pilot ID.
 * @apiSuccess {String} pilot.Name Pilot author Name.
 * @apiSuccess {String} pilot.Base Pilot author Base.
 * @apiSuccess {String} pilot.createdAt Pilot created createdAt.
 * @apiSuccess {String} pilot.updatedAt Pilot updated updatedAt.
 *
 * @apiSuccessExample Success-Response:
 *
 * HTTP/1.1 200 OK
 *
 * {
 *     "pilot": {
 *         "WorkDays": [
 *            "Monday",
 *            "Tuesday",
 *            "Thursday",
 *            "Saturday"
 *         ],
 *         "Bookings": [],
 *         "_id": "5efcc291c9ba404b64408a1a",
 *         "ID": 5,
 *         "Name": "Elvis",
 *         "Base": "Berlin",
 *         "__v": 0,
 *         "createdAt": "2020-07-01T17:06:25.776Z",
 *         "updatedAt": "2020-07-01T17:06:25.776Z"
 *     }
 * }
 *
 * @apiErrorExample {json} Endpoint not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Unauthorized
 *    HTTP/1.1 400 Availability checks must be for the future
 */
export const getAvailability = async (req, res, next) => {
  const { location, depDateTime, returnDateTime } = req.query;

  try {
    const timeNow = moment().unix();
    const departureTimestamp = moment(depDateTime).unix();
    const returnTimestamp = moment(returnDateTime).unix();

    if (departureTimestamp < timeNow || returnTimestamp < timeNow) {
      throw Error('Availability checks must be for the future')
    }

    const bookingsList = await Booking.getBookingsBetween(departureTimestamp, returnTimestamp);

    const bookedPilotIds = bookingsList.map((booking) => {
      return booking.pilot;
    });

    const weekdayOfFlight = moment(depDateTime).format('dddd');
    const pilotsList = await Pilot.getPilotsForBase(location, bookedPilotIds, weekdayOfFlight);

    return res.status(HTTPStatus.OK).send({
      pilot: pilotsList[0]
    });
  } catch (e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  }
}
