import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('✅ Email server is ready');
  }
});

// Send booking confirmation email
export async function sendBookingConfirmationEmail({ to, booking }) {
  try {
    const mailOptions = {
      from: `"CareNest" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `🎉 Booking Confirmed - ${booking.serviceName} | CareNest`,
      html: generateConfirmationHTML(booking)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    throw error;
  }
}

// Send invoice email (for paid bookings)
export async function sendInvoiceEmail({ to, booking, payment }) {
  try {
    const mailOptions = {
      from: `"CareNest" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `💳 Payment Receipt & Invoice - ${booking.serviceName} | CareNest`,
      html: generateInvoiceHTML(booking, payment)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Invoice email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending invoice email:', error);
    throw error;
  }
}

// Generate booking confirmation HTML
function generateConfirmationHTML(booking) {
  const bookingDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - CareNest</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1);">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #7aabb8 0%, #4d8a9b 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 42px; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">CareNest</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.95); font-size: 16px; letter-spacing: 1px;">Professional Care Services</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background-color: #1e293b; padding: 40px;">
              
              <!-- Success Icon -->
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; line-height: 80px;">
                  <span style="color: white; font-size: 40px;">✓</span>
                </div>
                <h2 style="margin: 20px 0 10px; color: white; font-size: 28px; font-weight: 700;">Booking Confirmed!</h2>
                <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 16px;">Your service has been successfully booked</p>
              </div>

              <!-- Booking Details Card -->
              <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin-bottom: 30px; backdrop-filter: blur(10px);">
                <table width="100%" cellpadding="10" cellspacing="0">
                  <tr>
                    <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 8px 0;">Booking ID:</td>
                    <td style="color: #7aabb8; font-size: 14px; font-weight: 700; text-align: right; padding: 8px 0;">#${booking._id.toString().slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 8px 0;">Date:</td>
                    <td style="color: white; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${bookingDate}</td>
                  </tr>
                  <tr>
                    <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 8px 0;">Status:</td>
                    <td style="text-align: right; padding: 8px 0;">
                      <span style="display: inline-block; background: rgba(245, 158, 11, 0.2); color: #fbbf24; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; border: 1px solid rgba(245, 158, 11, 0.3);">PENDING</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Service Details -->
              <h3 style="color: white; font-size: 18px; margin: 0 0 15px; font-weight: 600;">📋 Service Details</h3>
              <table width="100%" cellpadding="12" cellspacing="0" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td colspan="2" style="color: white; font-size: 16px; font-weight: 700; padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">${booking.serviceIcon || '🏥'} ${booking.serviceName}</td>
                </tr>
                <tr>
                  <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 12px;">Category</td>
                  <td style="color: white; font-size: 14px; padding: 12px; text-align: right; font-weight: 500;">${booking.category}</td>
                </tr>
                <tr>
                  <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 12px;">Duration</td>
                  <td style="color: white; font-size: 14px; padding: 12px; text-align: right; font-weight: 500;">${booking.duration} ${booking.durationType}</td>
                </tr>
                <tr>
                  <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 12px;">Location</td>
                  <td style="color: white; font-size: 14px; padding: 12px; text-align: right; font-weight: 500;">${booking.area}, ${booking.city}</td>
                </tr>
              </table>

              <!-- Total Cost -->
              <table width="100%" cellpadding="16" cellspacing="0" style="background: linear-gradient(135deg, rgba(122, 171, 184, 0.15), rgba(77, 138, 155, 0.15)); border: 1px solid rgba(122, 171, 184, 0.3); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="color: white; font-size: 18px; font-weight: 700;">Total Cost</td>
                  <td style="color: #7aabb8; font-size: 28px; font-weight: 700; text-align: right;">৳${booking.totalCost.toLocaleString()}</td>
                </tr>
              </table>

              <!-- Contact Info -->
              <h3 style="color: white; font-size: 18px; margin: 0 0 15px; font-weight: 600;">👤 Your Information</h3>
              <table width="100%" cellpadding="10" cellspacing="0" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 10px;">Name:</td>
                  <td style="color: white; font-size: 14px; text-align: right; padding: 10px; font-weight: 500;">${booking.name}</td>
                </tr>
                <tr>
                  <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 10px;">Phone:</td>
                  <td style="color: white; font-size: 14px; text-align: right; padding: 10px; font-weight: 500;">${booking.phone}</td>
                </tr>
                ${booking.email ? `
                <tr>
                  <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 10px;">Email:</td>
                  <td style="color: white; font-size: 14px; text-align: right; padding: 10px; font-weight: 500;">${booking.email}</td>
                </tr>
                ` : ''}
              </table>

              <!-- Next Steps -->
              <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15)); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 24px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 15px; color: #60a5fa; font-size: 16px; font-weight: 600;">📌 What Happens Next?</h4>
                <ul style="margin: 0; padding-left: 20px; color: rgba(255,255,255,0.8); line-height: 1.8;">
                  <li style="margin-bottom: 8px;">Our team will contact you within <strong style="color: white;">1 hour</strong></li>
                  <li style="margin-bottom: 8px;">We'll confirm your booking details and schedule</li>
                  <li style="margin-bottom: 8px;">You'll receive caregiver information via email</li>
                  <li>Service begins at your scheduled date and time</li>
                </ul>
              </div>

              <!-- Support Info -->
              <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">
                <p style="margin: 0 0 10px; color: rgba(255,255,255,0.7); font-size: 14px;">Need help? We're here 24/7</p>
                <p style="margin: 0; color: #7aabb8; font-size: 14px; font-weight: 600;">
                  📞 +880 1234-567890 | 📧 support@carenest.com
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0 0 10px; color: rgba(255,255,255,0.5); font-size: 14px;">Thank you for choosing CareNest</p>
              <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 12px;">
                Professional Baby Care, Elderly Care & Special Care Services in Bangladesh
              </p>
              <div style="margin-top: 15px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 10px 24px; background: linear-gradient(135deg, #7aabb8, #4d8a9b); color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">Visit Website</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Generate invoice HTML (for paid bookings)
function generateInvoiceHTML(booking, payment) {
  const invoiceDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - CareNest</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 42px; font-weight: bold;">CareNest</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.95); font-size: 16px;">PAYMENT INVOICE</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background-color: #1e293b; padding: 40px;">
              
              <!-- Success Icon -->
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; line-height: 80px;">
                  <span style="color: white; font-size: 40px;">✓</span>
                </div>
                <h2 style="margin: 20px 0 10px; color: white; font-size: 28px;">Payment Successful!</h2>
                <p style="margin: 0; color: rgba(255,255,255,0.7);">Your payment has been processed</p>
              </div>

              <!-- Invoice Details -->
              <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: rgba(255,255,255,0.6); font-size: 14px;">Invoice Number:</td>
                    <td style="color: #7aabb8; font-size: 14px; font-weight: 700; text-align: right;">#${booking._id.toString().slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="color: rgba(255,255,255,0.6); font-size: 14px;">Invoice Date:</td>
                    <td style="color: white; font-size: 14px; font-weight: 600; text-align: right;">${invoiceDate}</td>
                  </tr>
                  <tr>
                    <td style="color: rgba(255,255,255,0.6); font-size: 14px;">Payment Status:</td>
                    <td style="text-align: right;">
                      <span style="display: inline-block; background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; border: 1px solid rgba(16, 185, 129, 0.3);">PAID</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Service Details -->
              <h3 style="color: white; font-size: 18px; margin: 0 0 15px;">Service Details</h3>
              <table width="100%" cellpadding="12" cellspacing="0" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; margin-bottom: 30px;">
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                  <td style="color: white; font-size: 14px; font-weight: 600; padding: 12px;">Service</td>
                  <td style="color: white; font-size: 14px; padding: 12px; text-align: right;">${booking.serviceName}</td>
                </tr>
                <tr>
                  <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 12px;">Category</td>
                  <td style="color: white; font-size: 14px; padding: 12px; text-align: right;">${booking.category}</td>
                </tr>
                <tr>
                  <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 12px;">Duration</td>
                  <td style="color: white; font-size: 14px; padding: 12px; text-align: right;">${booking.duration} ${booking.durationType}</td>
                </tr>
                <tr>
                  <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 12px;">Location</td>
                  <td style="color: white; font-size: 14px; padding: 12px; text-align: right;">${booking.area}, ${booking.city}</td>
                </tr>
              </table>

              <!-- Payment Summary -->
              <table width="100%" cellpadding="16" cellspacing="0" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15)); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="color: white; font-size: 18px; font-weight: 700;">Total Amount Paid</td>
                  <td style="color: #10b981; font-size: 28px; font-weight: 700; text-align: right;">৳${booking.totalCost.toLocaleString()}</td>
                </tr>
              </table>

              <!-- Customer Info -->
              <h3 style="color: white; font-size: 18px; margin: 0 0 15px;">Contact Information</h3>
              <table width="100%" cellpadding="10" cellspacing="0" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="color: rgba(255,255,255,0.6); font-size: 14px;">Name:</td>
                  <td style="color: white; font-size: 14px; text-align: right;">${booking.name}</td>
                </tr>
                <tr>
                  <td style="color: rgba(255,255,255,0.6); font-size: 14px;">Phone:</td>
                  <td style="color: white; font-size: 14px; text-align: right;">${booking.phone}</td>
                </tr>
                ${booking.email ? `
                <tr>
                  <td style="color: rgba(255,255,255,0.6); font-size: 14px;">Email:</td>
                  <td style="color: white; font-size: 14px; text-align: right;">${booking.email}</td>
                </tr>
                ` : ''}
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0 0 10px; color: rgba(255,255,255,0.5); font-size: 14px;">Thank you for your payment</p>
              <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 12px;">
                CareNest - Professional Care Services | support@carenest.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export default { sendInvoiceEmail, sendBookingConfirmationEmail };