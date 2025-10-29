const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // Use Gmail service instead of manual SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Additional options for better reliability
    pool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5,
  });
};

// Send booking confirmation email to customer
const sendBookingConfirmation = async (booking) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"SEVENTEENVISUALS" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: "🎥 Booking Confirmed - SEVENTEENVISUALS",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #333;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0; text-transform: uppercase;">
              SEVENTEENVISUALS
            </h1>
            <p style="color: #888; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 1px;">
              CINEMATIC STORYTELLING
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; background-color: #0a0a0a;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px; margin-bottom: 16px;">🎬</div>
              <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
                Thank You for Booking!
              </h2>
              <p style="color: #888; margin: 0; font-size: 16px;">
                Hi ${booking.name}, your session is confirmed
              </p>
            </div>

            <!-- Booking Details Card -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border: 1px solid #333; border-radius: 12px; padding: 30px; margin: 30px 0;">
              <h3 style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
                📋 Booking Details
              </h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Booking ID</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600; font-size: 16px;">${
                      booking.bookingId
                    }</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Service</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600;">${booking.category
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Date</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600;">${new Date(
                      booking.date
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Duration</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600;">${
                      booking.minutes
                    } minutes</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Outfits</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600;">${
                      booking.outfits
                    }</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #888; font-size: 14px;">Investment</span>
                  </td>
                  <td style="padding: 12px 0; text-align: right;">
                    <span style="color: #ffffff; font-weight: 700; font-size: 18px;">$${
                      booking.price
                    }</span>
                  </td>
                </tr>
              </table>
                
              ${
                booking.notes
                  ? `
              <div style="margin-top: 16px; padding: 16px; background-color: #0a0a0a; border-radius: 8px; border-left: 3px solid #666;">
                <p style="color: #888; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Notes</p>
                <p style="color: #ffffff; margin: 0; font-size: 14px; line-height: 1.5;">${booking.notes}</p>
              </div>
              `
                  : ""
              }
            </div>

            <!-- Next Steps -->
            <div style="background-color: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
              <h4 style="color: #ffffff; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                ✨ What's Next?
              </h4>
              <p style="color: #888; margin: 0; font-size: 14px; line-height: 1.6;">
                We'll review your booking and get back to you within 24 hours. Keep your booking ID <strong style="color: #ffffff;">${
                  booking.bookingId
                }</strong> for reference.
              </p>
            </div>

            <!-- Contact -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #333;">
              <p style="color: #888; margin: 0 0 8px 0; font-size: 14px;">
                Questions? We're here to help.
              </p>
              <p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: 600;">
                The SEVENTEENVISUALS Team
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-top: 1px solid #333;">
            <p style="color: #666; margin: 0; font-size: 12px; line-height: 1.5;">
              © ${new Date().getFullYear()} SEVENTEENVISUALS<br>
              Professional Film & Videography Services
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    console.log("Attempting to send confirmation email to:", booking.email);
    const result = await transporter.sendMail(mailOptions);
    console.log(
      "✅ Booking confirmation email sent successfully:",
      result.messageId
    );
  } catch (error) {
    console.error(
      "❌ Error sending booking confirmation email:",
      error.message
    );
    throw error;
  }
};

// Send booking notification email to owner
const sendBookingNotification = async (booking) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"SEVENTEENVISUALS Booking System" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: `🎬 New Booking Alert - ${booking.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Notification</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #333;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0; text-transform: uppercase;">
              SEVENTEENVISUALS
            </h1>
            <p style="color: #888; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 1px;">
              BOOKING SYSTEM
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; background-color: #0a0a0a;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px; margin-bottom: 16px;">🚨</div>
              <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
                New Booking Received!
              </h2>
              <p style="color: #888; margin: 0; font-size: 16px;">
                A new client has booked your services
              </p>
            </div>

            <!-- Booking Information Card -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border: 1px solid #333; border-radius: 12px; padding: 30px; margin: 30px 0;">
              <h3 style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
                📋 Client Information
              </h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Booking ID</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600; font-size: 16px;">${
                      booking.bookingId
                    }</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Client Name</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600;">${
                      booking.name
                    }</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Email</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600;">${
                      booking.email
                    }</span>
                  </td>
                </tr>
                
                ${
                  booking.phone
                    ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Phone</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600;">${booking.phone}</span>
                  </td>
                </tr>
                `
                    : ""
                }
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Service</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600;">${booking.category
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Date</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600;">${new Date(
                      booking.date
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Duration</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600;">${
                      booking.minutes
                    } minutes</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Outfits</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 600;">${
                      booking.outfits
                    }</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Price</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff; font-weight: 700; font-size: 18px;">$${
                      booking.price
                    }</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #888; font-size: 14px;">Payment Status</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: ${
                      booking.paid ? "#4ade80" : "#f59e0b"
                    }; font-weight: 600;">${
      booking.paid ? "✅ Paid" : "⏳ Pending"
    }</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #888; font-size: 14px;">Status</span>
                  </td>
                  <td style="padding: 12px 0; text-align: right;">
                    <span style="color: #f59e0b; font-weight: 600; text-transform: uppercase;">${
                      booking.status
                    }</span>
                  </td>
                </tr>
              </table>
                
              ${
                booking.notes
                  ? `
              <div style="margin-top: 16px; padding: 16px; background-color: #0a0a0a; border-radius: 8px; border-left: 3px solid #666;">
                <p style="color: #888; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Client Notes</p>
                <p style="color: #ffffff; margin: 0; font-size: 14px; line-height: 1.5;">${booking.notes}</p>
              </div>
              `
                  : ""
              }
            </div>

            <!-- Action Required -->
            <div style="background-color: #1a1a1a; border: 1px solid #f59e0b; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
              <h4 style="color: #f59e0b; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                ⚡ Action Required
              </h4>
              <p style="color: #888; margin: 0; font-size: 14px; line-height: 1.6;">
                Please review and approve this booking in your admin panel. The client is waiting for confirmation.
              </p>
            </div>

            <!-- Booking Time -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #333;">
              <p style="color: #888; margin: 0; font-size: 12px;">
                Booking created: ${new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-top: 1px solid #333;">
            <p style="color: #666; margin: 0; font-size: 12px; line-height: 1.5;">
              © ${new Date().getFullYear()} SEVENTEENVISUALS<br>
              Booking Management System
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    console.log(
      "Attempting to send notification email to owner:",
      process.env.OWNER_EMAIL
    );
    const result = await transporter.sendMail(mailOptions);
    console.log(
      "✅ Booking notification email sent successfully:",
      result.messageId
    );
  } catch (error) {
    console.error(
      "❌ Error sending booking notification email:",
      error.message
    );
    throw error;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendBookingNotification,
};
