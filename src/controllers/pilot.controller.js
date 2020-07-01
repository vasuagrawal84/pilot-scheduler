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

export const create = async (req, res, next) => {
  const { ID, Name, Base, WorkDays } = req.body;

  Pilot.createPilot(ID, Name, Base, WorkDays).then(() => {
    return res.status(HTTPStatus.CREATED).send();
  }).catch((e) => {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  });
}

export const getAvailability = async (req, res, next) => {
  const { location, depDateTime, returnDateTime } = req.query;

  try {
    // const timeNow = moment().unix();
    const departureTimestamp = moment(depDateTime).unix();
    const returnTimestamp = moment(returnDateTime).unix();
    // if (departureTimestamp < timeNow || returnTimestamp < timeNow) {
    //   throw Error('Availability checks must be for the future')
    // }

    const bookingsList = await Booking.getBookingsBetweenAt(location, departureTimestamp, returnTimestamp);

    const bookedPilotIds = bookingsList.map((booking) => {
      return booking.pilot;
    });

    const pilotsList = await Pilot.getPilotsForBase(location, bookedPilotIds);

    return res.status(HTTPStatus.OK).send({
      pilotId: pilotsList[0]
    });
  } catch (e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  }
}
