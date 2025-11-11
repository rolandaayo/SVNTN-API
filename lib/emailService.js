const nodemailer = require("nodemailer");

// Helper function to get display name for categories
const getCategoryDisplayName = (category) => {
  const categoryNames = {
    commercials: "Commercials - Brands",
    music_videos: "Music Videos",
    bts_documentary: "Behind The Scenes",
  };
  return categoryNames[category] || category;
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // Using Gmail service instead of manual SMTP
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
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <title>Booking Confirmation</title>
        <style>
          /* Force colors in dark mode - override email client dark mode */
          @media (prefers-color-scheme: dark) {
            .force-white { color: #ffffff !important; }
            .force-light { color: #e5e5e5 !important; }
            .force-bg-dark { background-color: #0a0a0a !important; }
            * { color-scheme: light !important; }
          }
          /* Ensure all text has proper contrast */
          .email-text { color: #ffffff !important; }
          .email-subtext { color: #e5e5e5 !important; }
          .email-muted { color: #d1d1d1 !important; }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #333;">
            <h1 style="color: #ffffff !important; font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0; text-transform: uppercase;">
              SEVENTEENVISUALS
            </h1>
            <p style="color: #e5e5e5 !important; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 1px;">
              CINEMATIC STORYTELLING
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; background-color: #0a0a0a;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px; margin-bottom: 16px;">🎬</div>
              <h2 style="color: #ffffff !important; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
                Thank You for Booking!
              </h2>
              <p style="color: #e5e5e5 !important; margin: 0; font-size: 16px;">
                Hi ${booking.name}, your session is confirmed
              </p>
            </div>

            <!-- Booking Details Card -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border: 1px solid #333; border-radius: 12px; padding: 30px; margin: 30px 0;">
              <h3 style="color: #ffffff !important; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
                📋 Booking Details
              </h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Booking ID</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600; font-size: 16px;">${
                      booking.bookingId
                    }</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Service</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${getCategoryDisplayName(
                      booking.category
                    )}</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Date</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${new Date(
                      booking.date
                    ).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Duration</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${
                      booking.minutes
                    } minutes</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Outfits</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${
                      booking.outfits
                    }</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Investment</span>
                  </td>
                  <td style="padding: 12px 0; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 700; font-size: 18px;">₦${booking.price.toLocaleString()}</span>
                  </td>
                </tr>
              </table>
                
              ${
                booking.notes
                  ? `
              <div style="margin-top: 16px; padding: 16px; background-color: #0a0a0a; border-radius: 8px; border-left: 3px solid #666;">
                <p style="color: #e5e5e5 !important; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Notes</p>
                <p style="color: #ffffff !important; margin: 0; font-size: 14px; line-height: 1.5;">${booking.notes}</p>
              </div>
              `
                  : ""
              }
            </div>

            <!-- Next Steps -->
            <div style="background-color: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
              <h4 style="color: #ffffff !important; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                ✨ What's Next?
              </h4>
              <p style="color: #e5e5e5 !important; margin: 0; font-size: 14px; line-height: 1.6;">
                We'll review your booking and get back to you within 24 hours. Keep your booking ID <strong style="color: #ffffff !important;">${
                  booking.bookingId
                }</strong> for reference.
              </p>
            </div>

            <!-- Contact -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #333;">
              <p style="color: #e5e5e5 !important; margin: 0 0 8px 0; font-size: 14px;">
                Questions? We're here to help.
              </p>
              <p style="color: #ffffff !important; margin: 0; font-size: 16px; font-weight: 600;">
                The SEVENTEENVISUALS Team
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-top: 1px solid #333;">
            <p style="color: #d1d1d1 !important; margin: 0; font-size: 12px; line-height: 1.5;">
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
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <title>New Booking Notification</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #333;">
            <h1 style="color: #ffffff !important; font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0; text-transform: uppercase;">
              SEVENTEENVISUALS
            </h1>
            <p style="color: #e5e5e5 !important; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 1px;">
              BOOKING SYSTEM
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; background-color: #0a0a0a;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px; margin-bottom: 16px;">🚨</div>
              <h2 style="color: #ffffff !important; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
                New Booking Received!
              </h2>
              <p style="color: #e5e5e5 !important; margin: 0; font-size: 16px;">
                A new client has booked your services
              </p>
            </div>

            <!-- Booking Information Card -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border: 1px solid #333; border-radius: 12px; padding: 30px; margin: 30px 0;">
              <h3 style="color: #ffffff !important; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
                📋 Client Information
              </h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Booking ID</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600; font-size: 16px;">${
                      booking.bookingId
                    }</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Client Name</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${
                      booking.name
                    }</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Email</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${
                      booking.email
                    }</span>
                  </td>
                </tr>
                
                ${
                  booking.phone
                    ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Phone</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${booking.phone}</span>
                  </td>
                </tr>
                `
                    : ""
                }
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Service</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${getCategoryDisplayName(
                      booking.category
                    )}</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Date</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${new Date(
                      booking.date
                    ).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Duration</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${
                      booking.minutes
                    } minutes</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Outfits</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${
                      booking.outfits
                    }</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Price</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 700; font-size: 18px;">₦${booking.price.toLocaleString()}</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Payment Status</span>
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
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Status</span>
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
                <p style="color: #e5e5e5 !important; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Client Notes</p>
                <p style="color: #ffffff !important; margin: 0; font-size: 14px; line-height: 1.5;">${booking.notes}</p>
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
              <p style="color: #e5e5e5 !important; margin: 0; font-size: 14px; line-height: 1.6;">
                Please review and approve this booking in your admin panel. The client is waiting for confirmation.
              </p>
            </div>

            <!-- Booking Time -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #333;">
              <p style="color: #e5e5e5 !important; margin: 0; font-size: 12px;">
                Booking created: ${new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-top: 1px solid #333;">
            <p style="color: #d1d1d1 !important; margin: 0; font-size: 12px; line-height: 1.5;">
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

// Send payment confirmation email
const sendPaymentConfirmation = async (booking, paymentReference) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"SEVENTEENVISUALS" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: "💳 Payment Received - SEVENTEENVISUALS",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #333;">
            <h1 style="color: #ffffff !important; font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0; text-transform: uppercase;">
              SEVENTEENVISUALS
            </h1>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; background-color: #0a0a0a;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
              <h2 style="color: #4ade80 !important; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
                Payment Received!
              </h2>
              <p style="color: #e5e5e5 !important; margin: 0; font-size: 16px;">
                Thank you ${booking.name}, your payment has been confirmed
              </p>
            </div>

            <!-- Payment Details -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border: 1px solid #4ade80; border-radius: 12px; padding: 30px; margin: 30px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Booking ID</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${
                      booking.bookingId
                    }</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Amount Paid</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #4ade80 !important; font-weight: 700; font-size: 18px;">₦${booking.paymentAmount.toLocaleString()}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Payment Reference</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600; font-size: 12px;">${paymentReference}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Status</span>
                  </td>
                  <td style="padding: 12px 0; text-align: right;">
                    <span style="color: #4ade80 !important; font-weight: 600;">✅ CONFIRMED</span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Session Details -->
            <div style="background-color: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 24px; margin: 30px 0;">
              <h4 style="color: #ffffff !important; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">
                📅 Your Session Details
              </h4>
              <p style="color: #e5e5e5 !important; margin: 0 0 8px 0; font-size: 14px;">
                <strong style="color: #ffffff !important;">Service:</strong> ${getCategoryDisplayName(
                  booking.category
                )}
              </p>
              <p style="color: #e5e5e5 !important; margin: 0 0 8px 0; font-size: 14px;">
                <strong style="color: #ffffff !important;">Date:</strong> ${new Date(
                  booking.date
                ).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p style="color: #e5e5e5 !important; margin: 0; font-size: 14px;">
                <strong style="color: #ffffff !important;">Duration:</strong> ${
                  booking.minutes
                } minutes
              </p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <p style="color: #e5e5e5 !important; margin: 0 0 8px 0; font-size: 14px;">
                We're excited to work with you!
              </p>
              <p style="color: #ffffff !important; margin: 0; font-size: 16px; font-weight: 600;">
                The SEVENTEENVISUALS Team
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-top: 1px solid #333;">
            <p style="color: #d1d1d1 !important; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} SEVENTEENVISUALS
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Payment confirmation email sent");
  } catch (error) {
    console.error("❌ Error sending payment confirmation:", error.message);
    throw error;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendBookingNotification,
  sendPaymentConfirmation,
};

// Send preset purchase confirmation email
const sendPresetPurchaseEmail = async (
  email,
  name,
  presetName,
  price,
  paymentReference
) => {
  const transporter = createTransporter();

  // Download link (you can customize this)
  const downloadLink = `https://yourwebsite.com/downloads/${paymentReference}`;

  const mailOptions = {
    from: `"SEVENTEENVISUALS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎨 Your Preset is Ready - SEVENTEENVISUALS",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preset Purchase Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #333;">
            <h1 style="color: #ffffff !important; font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0; text-transform: uppercase;">
              SEVENTEENVISUALS
            </h1>
            <p style="color: #e5e5e5 !important; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 1px;">
              COLOR GRADING PRESETS
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; background-color: #0a0a0a;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px; margin-bottom: 16px;">🎨</div>
              <h2 style="color: #4ade80 !important; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
                Thank You for Your Purchase!
              </h2>
              <p style="color: #e5e5e5 !important; margin: 0; font-size: 16px;">
                Hi ${name}, your preset is ready to download
              </p>
            </div>

            <!-- Purchase Details -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border: 1px solid #4ade80; border-radius: 12px; padding: 30px; margin: 30px 0;">
              <h3 style="color: #ffffff !important; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
                📦 Purchase Details
              </h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Preset</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${presetName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Amount Paid</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #4ade80 !important; font-weight: 700; font-size: 18px;">₦${price.toLocaleString()}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Reference</span>
                  </td>
                  <td style="padding: 12px 0; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600; font-size: 12px;">${paymentReference}</span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Download Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${downloadLink}" style="display: inline-block; padding: 16px 40px; background-color: #4ade80; color: #000000 !important; text-decoration: none; font-weight: 700; font-size: 16px; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">
                Download Your Preset
              </a>
              <p style="color: #e5e5e5 !important; margin: 16px 0 0 0; font-size: 12px;">
                Or copy this link: <br>
                <span style="color: #4ade80 !important; word-break: break-all;">${downloadLink}</span>
              </p>
            </div>

            <!-- Installation Instructions -->
            <div style="background-color: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 24px; margin: 30px 0;">
              <h4 style="color: #ffffff !important; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">
                📝 Installation Instructions
              </h4>
              <ol style="color: #e5e5e5 !important; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                <li>Download the preset file from the link above</li>
                <li>Open your editing software (Premiere Pro, Final Cut, DaVinci Resolve, etc.)</li>
                <li>Import the preset file into your color grading panel</li>
                <li>Apply the preset to your footage and adjust as needed</li>
              </ol>
            </div>

            <!-- Support -->
            <div style="background-color: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
              <h4 style="color: #ffffff !important; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                Need Help?
              </h4>
              <p style="color: #e5e5e5 !important; margin: 0; font-size: 14px; line-height: 1.6;">
                If you have any questions or need assistance with installation, feel free to reach out to us. We're here to help!
              </p>
            </div>

            <!-- Thank You -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #333;">
              <p style="color: #e5e5e5 !important; margin: 0 0 8px 0; font-size: 14px;">
                Thank you for supporting SEVENTEENVISUALS!
              </p>
              <p style="color: #ffffff !important; margin: 0; font-size: 16px; font-weight: 600;">
                Happy Editing! 🎬
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-top: 1px solid #333;">
            <p style="color: #d1d1d1 !important; margin: 0; font-size: 12px; line-height: 1.5;">
              © ${new Date().getFullYear()} SEVENTEENVISUALS<br>
              Professional Color Grading Presets
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Preset purchase email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending preset purchase email:", error.message);
    throw error;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendBookingNotification,
  sendPaymentConfirmation,
  sendPresetPurchaseEmail,
};

// Send preset purchase notification to owner
const sendPresetPurchaseNotification = async (
  email,
  name,
  presetName,
  price,
  paymentReference
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"SEVENTEENVISUALS Sales" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: `💰 New Preset Sale - ${presetName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Preset Sale</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #333;">
            <h1 style="color: #ffffff !important; font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0; text-transform: uppercase;">
              SEVENTEENVISUALS
            </h1>
            <p style="color: #e5e5e5 !important; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 1px;">
              SALES NOTIFICATION
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; background-color: #0a0a0a;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px; margin-bottom: 16px;">💰</div>
              <h2 style="color: #4ade80 !important; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
                New Preset Sale!
              </h2>
              <p style="color: #e5e5e5 !important; margin: 0; font-size: 16px;">
                A customer just purchased a preset
              </p>
            </div>

            <!-- Sale Details -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border: 1px solid #4ade80; border-radius: 12px; padding: 30px; margin: 30px 0;">
              <h3 style="color: #ffffff !important; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
                📦 Sale Details
              </h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Customer Email</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${email}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Preset Purchased</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${presetName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Amount</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #4ade80 !important; font-weight: 700; font-size: 18px;">₦${price.toLocaleString()}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Payment Reference</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600; font-size: 12px;">${paymentReference}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #e5e5e5 !important; font-size: 14px;">Date & Time</span>
                  </td>
                  <td style="padding: 12px 0; text-align: right;">
                    <span style="color: #ffffff !important; font-weight: 600;">${new Date().toLocaleString()}</span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Action Required -->
            <div style="background-color: #1a1a1a; border: 1px solid #4ade80; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
              <h4 style="color: #4ade80 !important; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                ✅ Action Required
              </h4>
              <p style="color: #e5e5e5 !important; margin: 0; font-size: 14px; line-height: 1.6;">
                The customer has been sent an email with the download link. Make sure the preset file is available for download.
              </p>
            </div>

            <!-- Summary -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #333;">
              <p style="color: #e5e5e5 !important; margin: 0; font-size: 14px;">
                Keep up the great work! 🎉
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-top: 1px solid #333;">
            <p style="color: #d1d1d1 !important; margin: 0; font-size: 12px; line-height: 1.5;">
              © ${new Date().getFullYear()} SEVENTEENVISUALS<br>
              Sales Notification System
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Preset purchase notification sent to owner");
  } catch (error) {
    console.error(
      "❌ Error sending preset notification to owner:",
      error.message
    );
    throw error;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendBookingNotification,
  sendPaymentConfirmation,
  sendPresetPurchaseEmail,
  sendPresetPurchaseNotification,
};
