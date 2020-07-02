/* eslint-disable import/no-mutable-exports */

import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import Pilot from './pilot.model';

const BookingSchema = new Schema(
  {
    _bookingId: Schema.Types.ObjectId,
    depDateTime: {
      type: Schema.Types.Number,
      trim: true,
      required: [true, 'Departure time is required!'],
    },
    returnDateTime: {
      type: Schema.Types.Number,
      trim: true,
      required: [true, 'Return time is required!'],
    },
    pilot: {
      type: Schema.Types.ObjectId,
      ref: 'Pilot',
      required: [true, 'pilotId is required!'],
    },
  },
  { timestamps: true },
);

BookingSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken!',
});

BookingSchema.statics = {
  async createBooking(pilot, depDateTime, returnDateTime) {
    try {
      const created = await this.create({
        depDateTime,
        returnDateTime,
        pilot: pilot._id,
      });

      await Pilot.addBooking(pilot._id, created._id);

      return created;
    } catch (err) {
      return err;
    }
  },

  async getBookingsBetween(departDateTime, returnDateTime) {
    return this.find({
      depDateTime: { $gte: departDateTime },
      returnDateTime: { $lte: returnDateTime }
    }).populate('Pilot');
  },

  async isAlreadyBooked(pilot, departDateTime, returnDateTime) {
    const pilotBookings = await this.find({
      pilot: pilot._id,
      depDateTime: { $gte: departDateTime },
      returnDateTime: { $lte: returnDateTime }
    }).populate('Pilot');

    return pilotBookings.length > 0;
  },
};

BookingSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      depDateTime: this.depDateTime,
      returnDateTime: this.returnDateTime,
      pilotId: this.pilotId,
      createdAt: this.createdAt,
    };
  },
};

let Booking;

try {
  Booking = mongoose.model('Booking');
} catch (e) {
  Booking = mongoose.model('Booking', BookingSchema);
}

export default Booking;
