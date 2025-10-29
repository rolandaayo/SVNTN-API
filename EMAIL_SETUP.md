# Email Setup for SEVENTEENVISUALS

## Gmail App Password Setup

To enable email functionality, you need to set up a Gmail App Password:

1. **Enable 2-Factor Authentication** on your Gmail account if not already enabled
2. **Generate App Password**:

   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
   - Copy the 16-character password (without spaces)

3. **Update .env file**:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

## Email Design & Flow

The emails now match your website's cinematic dark theme:

### Customer Confirmation Email 🎬

- **Dark theme** with gradients and professional styling
- **SEVENTEENVISUALS branding** matching your website
- **Cinematic elements** with film emojis and modern typography
- **Complete booking details** in a styled card format
- **Clear next steps** and contact information

### Owner Notification Email 🚨

- **Alert-style design** for immediate attention
- **Complete client information** for easy review
- **Action required section** highlighting need for approval
- **Professional admin panel styling**
- **All booking details** including payment status

Both emails are sent automatically when a booking is created successfully.

## Testing

After setting up your Gmail credentials, test the booking endpoint:

```bash
curl -X POST http://localhost:4000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "date": "2024-12-01",
    "category": "commercials"
  }'
```

Check both email addresses for the themed confirmation and notification emails.

## Email Features

- **Responsive design** that works on mobile and desktop
- **Professional branding** consistent with your website
- **Clear typography** with proper hierarchy
- **Action-oriented** with clear next steps
- **Error handling** that doesn't break booking creation

## Troubleshooting

- Ensure Gmail App Password is correct (16 characters, no spaces)
- Check spam folders for test emails
- Verify EMAIL_HOST and EMAIL_PORT are correct
- Check server logs for email sending errors
- Test with a real email address first
