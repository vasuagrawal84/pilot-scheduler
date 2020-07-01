/* eslint-disable import/no-mutable-exports */

import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import constants from '../config/constants';

const PilotSchema = new Schema(
  {
    ID: {
      type: Number,
      unique: true,
      required: [true, 'Id is required!'],
      trim: true,
    },
    Name: {
      type: String,
      trim: true,
      required: [true, 'Name is required!'],
    },
    Base: {
      type: String,
      trim: true,
      required: [true, 'Base is required!'],
    },
    WorkDays: [
      {
        type: String,
        trim: true,
      }
    ],
    Bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
  },
  { timestamps: true },
);

PilotSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken!',
});

PilotSchema.statics = {
  createPilot(pilotId, name, base, workDays, bookings) {
    try {
      return this.create({
        ID: pilotId,
        Name: name,
        Base: base,
        WorkDays: workDays || [],
        Bookings: bookings || []
      });
    } catch (err) {
      return err;
    }
  },

  addBooking(pilotId, bookingId) {
    return this.update({ pilotId }, { $push: { Bookings: bookingId } }, { multi: false })
  },

  getPilotsForBase(location, excludePilodIds, dayOfWeek) {
    return this.find(
      {
        Base: location,
        _id: { $nin: excludePilodIds },
        WorkDays: dayOfWeek
      }
    )
      .sort({ updatedAt: 1 })
      .populate('Booking');
  },

  toJSON() {
    return {
      _id: this._id,
      Name: this.Name,
      Base: this.Base
    };
  },
};

let Pilot;

try {
  Pilot = mongoose.model('Pilot');
} catch (e) {
  Pilot = mongoose.model('Pilot', PilotSchema);
}

export default Pilot;
