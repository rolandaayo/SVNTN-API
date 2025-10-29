const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    date: { type: Date, required: true },
    minutes: { type: Number, default: 60 },
    outfits: { type: Number, default: 1 },
    category: {
      type: String,
      enum: ["commercials", "music_videos", "bts_documentary"],
      required: true,
    },
    price: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
