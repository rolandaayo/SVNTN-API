const Booking = require("../models/booking");
const Counter = require("../models/counter");
const {
  sendBookingConfirmation,
  sendBookingNotification,
} = require("../lib/emailService");

async function getNextBookingId() {
  // atomically increment counter and return a unique ID like SVN-32126
  const result = await Counter.findOneAndUpdate(
    { name: "booking" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const seq = result.seq || 0;
  // create a semi-random 5-digit number mixing the seq and timestamp to reduce collisions
  const suffix = String((seq + (Date.now() % 90000)) % 90000).padStart(5, "0");
  return `SVN-${suffix}`;
}

exports.createBooking = async (req, res) => {
  try {
    const { name, email, phone, date, notes, minutes, outfits, category } =
      req.body;
    if (!name || !email || !date || !category)
      return res
        .status(400)
        .json({ error: "name, email, date and category are required" });

    // price mapping by category in Naira
    const priceMap = {
      commercials: 350000,
      music_videos: 450000,
      bts_documentary: 150000,
    };
    const price = priceMap[category] || 0;

    const bookingId = await getNextBookingId();
    const booking = new Booking({
      bookingId,
      name,
      email,
      phone,
      date,
      minutes: minutes || 60,
      outfits: outfits || 1,
      category,
      price,
      notes,
    });
    await booking.save();

    // DON'T send emails here - wait for payment confirmation
    // Emails will be sent after successful payment in the payment verification endpoint

    return res.status(201).json(booking);
  } catch (err) {
    console.error("createBooking error", err);
    return res.status(500).json({ error: "server error" });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    let { id } = req.params; // accept either 'SVN-001' or '001'
    // normalize id: allow lookups with or without the SVN- prefix
    if (id && id.startsWith("SVN-")) id = id.replace(/^SVN-/, "SVN-");
    // try exact match first
    let booking = await Booking.findOne({ bookingId: id });
    if (!booking) {
      // if id was just numeric (e.g. 001), try matching both numeric and SVN-prefixed
      const numeric = id.replace(/^SVN-/, "");
      booking =
        (await Booking.findOne({ bookingId: numeric })) ||
        (await Booking.findOne({ bookingId: `SVN-${numeric}` }));
    }
    if (!booking) return res.status(404).json({ error: "not found" });
    return res.json(booking);
  } catch (err) {
    console.error("getBookingById error", err);
    return res.status(500).json({ error: "server error" });
  }
};

exports.listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    console.error("listBookings error", err);
    return res.status(500).json({ error: "server error" });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOneAndUpdate(
      { bookingId: id },
      { status: "approved" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: "not found" });
    return res.json(booking);
  } catch (err) {
    console.error("approveBooking error", err);
    return res.status(500).json({ error: "server error" });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Booking.findOneAndDelete({ bookingId: id });
    if (!result) return res.status(404).json({ error: "not found" });
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteBooking error", err);
    return res.status(500).json({ error: "server error" });
  }
};
