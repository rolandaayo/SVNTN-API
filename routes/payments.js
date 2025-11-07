const express = require("express");
const router = express.Router();
const { initializePayment, verifyPayment } = require("../lib/paystackService");
const Booking = require("../models/booking");
const {
  sendPaymentConfirmation,
  sendBookingConfirmation,
  sendBookingNotification,
  sendPresetPurchaseEmail,
  sendPresetPurchaseNotification,
} = require("../lib/emailService");

// Get Paystack public key
router.get("/config", (req, res) => {
  res.json({
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
  });
});

// Initialize payment for preset purchase
router.post("/initialize-preset", async (req, res) => {
  try {
    const { email, presetName, price } = req.body;

    if (!email || !presetName || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const metadata = {
      type: "preset",
      presetName,
      customer_email: email,
    };

    const paymentData = await initializePayment(email, price, metadata);

    res.json({
      success: true,
      authorization_url: paymentData.data.authorization_url,
      reference: paymentData.data.reference,
    });
  } catch (error) {
    console.error("Preset payment initialization error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Initialize payment for booking
router.post("/initialize-booking", async (req, res) => {
  try {
    const { bookingId, email, amount } = req.body;

    if (!bookingId || !email || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const metadata = {
      type: "booking",
      bookingId,
      customer_email: email,
    };

    const paymentData = await initializePayment(email, amount, metadata);

    res.json({
      success: true,
      authorization_url: paymentData.data.authorization_url,
      reference: paymentData.data.reference,
    });
  } catch (error) {
    console.error("Booking payment initialization error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.get("/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    const verification = await verifyPayment(reference);

    if (verification.data.status === "success") {
      const metadata = verification.data.metadata;

      // Handle preset purchase
      if (metadata.type === "preset") {
        try {
          // Send email to customer
          await sendPresetPurchaseEmail(
            metadata.customer_email,
            metadata.customer_email.split("@")[0], // Use email username as name
            metadata.presetName,
            verification.data.amount / 100, // Convert from kobo
            reference
          );

          // Send notification to owner
          await sendPresetPurchaseNotification(
            metadata.customer_email,
            metadata.customer_email.split("@")[0],
            metadata.presetName,
            verification.data.amount / 100,
            reference
          );

          console.log(`Preset purchase emails sent for ${metadata.presetName}`);
        } catch (emailError) {
          console.error("Failed to send preset purchase emails:", emailError);
        }
      }

      // Update booking status if it's a booking payment
      if (metadata.type === "booking" && metadata.bookingId) {
        const updatedBooking = await Booking.findOneAndUpdate(
          { bookingId: metadata.bookingId },
          {
            status: "confirmed",
            paymentStatus: "paid",
            paymentReference: reference,
            paymentAmount: verification.data.amount / 100, // Convert from kobo
            paid: true,
          },
          { new: true }
        );

        // Send all emails after successful payment
        if (updatedBooking) {
          try {
            // Send booking confirmation to customer
            await sendBookingConfirmation(updatedBooking);

            // Send payment confirmation to customer
            await sendPaymentConfirmation(updatedBooking, reference);

            // Send notification to owner
            await sendBookingNotification(updatedBooking);

            console.log(
              `All emails sent successfully for booking ${metadata.bookingId}`
            );
          } catch (emailError) {
            console.error("Failed to send emails:", emailError);
          }
        }
      }

      res.json({
        success: true,
        message: "Payment verified successfully",
        data: verification.data,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
