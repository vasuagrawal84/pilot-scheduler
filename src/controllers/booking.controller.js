import Joi from 'joi';
import HTTPStatus from 'http-status';

import Booking from '../models/booking.model';
import Pilot from '../models/pilot.model';

// TODO: add docs

export async function getList(req, res, next) {
  // try {
  //   const { pilotId, depDateTime, returnDateTime } = req.query;

  //   const promise = await Promise.all([
  //     Pilot.getPilotsAtBase(),
  //     Booking.list({ skip: req.query.skip, limit: req.query.limit }),
  //   ]);

  //   const postsWithFavorite = promise[1].reduce((arr, post) => {
  //     const favorite = promise[0]._favorites.isPostIsFavorite(post._id);
  //     arr.push({
  //       ...post.toJSON(),
  //       favorite,
  //     });

  //     return arr;
  //   }, []);

  //   return res.status(HTTPStatus.OK).json(postsWithFavorite);
  // } catch (err) {
  //   err.status = HTTPStatus.BAD_REQUEST;
  //   return next(err);
  // }
}

export async function create(req, res, next) {
  const { pilotId, depDateTime, returnDateTime } = req.body;
  const pilot = await Pilot.findOne({ ID: pilotId });
  try {
    return res
      .status(HTTPStatus.CREATED)
      .json(await Booking.createBooking(pilot, depDateTime, returnDateTime));
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
