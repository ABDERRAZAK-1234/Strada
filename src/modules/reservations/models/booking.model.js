import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    departureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Departure',
      required: true,
      index: true
    },
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    passengerName: {
      type: String,
      required: true,
      trim: true
    },
    seatNumber: {
      type: Number,
      required: true,
      min: 1
    },
    priceCents: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED', 'BOARDED'],
      default: 'CONFIRMED'
    },
    occupiesSeat: {
      type: Boolean,
      default: true
    },
    cancelReason: {
      type: String,
      enum: ['CUSTOMER', 'DEPARTURE', null],
      default: null
    },
    ticketCode: {
      type: String,
      required: true,
      unique: true
    },
    boardedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index(
  { departureId: 1, seatNumber: 1 },
  { unique: true, partialFilterExpression: { occupiesSeat: true } }
);

bookingSchema.index(
  { departureId: 1, passengerId: 1 },
  { unique: true, partialFilterExpression: { occupiesSeat: true } }
);

export const Booking = mongoose.model('Booking', bookingSchema);