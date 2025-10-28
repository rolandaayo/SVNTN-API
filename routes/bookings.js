const express = require("express");
const router = express.Router();
const controller = require("../controllers/bookings");
const adminAuth = require("../middleware/adminAuth");

// Public: create booking or get by ID
router.post("/", controller.createBooking);
router.get("/:id", controller.getBookingById);

// Admin routes
router.get("/", adminAuth, controller.listBookings);
router.patch("/:id/approve", adminAuth, controller.approveBooking);
router.delete("/:id", adminAuth, controller.deleteBooking);

module.exports = router;
