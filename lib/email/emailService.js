import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
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
    console.log('Email server is ready');
  }
});

// Send invoice email
export async function sendInvoiceEmail({ to, booking, payment }) {
  try {
    const mailOptions = {
      from: `"Care.xyz" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `Booking Confirmation & Invoice - ${booking.serviceName}`,
      html: generateInvoiceHTML(booking, payment)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending invoice email:', error);
    throw error;
  }
}

// Send booking confirmation email
export async function sendBookingConfirmationEmail({ to, booking }) {
  try {
    const mailOptions = {
      from: `"Care.xyz" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `Booking Confirmed - ${booking.serviceName}`,
      html: generateConfirmationHTML(booking)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

// Generate invoice HTML
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
  <title>Invoice - Care.xyz</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #a3c4e0 0%, #0b4345 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 36px; font-weight: bold;">Care.xyz</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Baby Sitting & Elderly Care Services</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background-color: white; padding: 40px;">
              
              <!-- Success Icon -->
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; position: relative;">
                  <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 40px;">✓</span>
                </div>
                <h2 style="margin: 20px 0 10px; color: #1f2937; font-size: 28px;">Payment Successful!</h2>
                <p style="margin: 0; color: #6b7280;">Your booking has been confirmed</p>
              </div>

              <!-- Invoice Details -->
              <div style="background-color: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Invoice Number:</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">#${booking._id.toString().slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Invoice Date:</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${invoiceDate}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Payment Status:</td>
                    <td style="text-align: right;">
                      <span style="display: inline-block; background-color: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">PAID</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Service Details -->
              <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px;">Service Details</h3>
              <table width="100%" cellpadding="10" cellspacing="0" style="margin-bottom: 30px;">
                <tr style="background-color: #f9fafb;">
                  <td style="color: #1f2937; font-size: 14px; font-weight: 600; padding: 12px; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">Service</td>
                  <td style="color: #1f2937; font-size: 14px; padding: 12px; text-align: right; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">${booking.serviceName}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 12px;">Category</td>
                  <td style="color: #1f2937; font-size: 14px; padding: 12px; text-align: right;">${booking.category}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 12px;">Duration</td>
                  <td style="color: #1f2937; font-size: 14px; padding: 12px; text-align: right;">${booking.duration} ${booking.durationType}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 12px;">Location</td>
                  <td style="color: #1f2937; font-size: 14px; padding: 12px; text-align: right;">${booking.area}, ${booking.city}</td>
                </tr>
              </table>

              <!-- Payment Summary -->
              <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #f9fafb; border-radius: 10px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #1f2937; font-size: 18px; font-weight: 700;">Total Amount Paid</td>
                  <td style="color: #0b4345; font-size: 24px; font-weight: 700; text-align: right;">৳${booking.totalCost.toLocaleString()}</td>
                </tr>
              </table>

              <!-- Customer Info -->
              <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px;">Contact Information</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Name:</td>
                  <td style="color: #1f2937; font-size: 14px; text-align: right;">${booking.name}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Phone:</td>
                  <td style="color: #1f2937; font-size: 14px; text-align: right;">${booking.phone}</td>
                </tr>
                ${booking.email ? `
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Email:</td>
                  <td style="color: #1f2937; font-size: 14px; text-align: right;">${booking.email}</td>
                </tr>
                ` : ''}
              </table>

              <!-- Next Steps -->
              <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 15px; color: #1e40af; font-size: 16px;">📋 What's Next?</h4>
                <ol style="margin: 0; padding-left: 20px; color: #1e40af;">
                  <li style="margin-bottom: 10px;">Our team will contact you within 1 hour</li>
                  <li style="margin-bottom: 10px;">You'll receive caregiver details via email</li>
                  <li style="margin-bottom: 10px;">Service begins at your scheduled time</li>
                  <li>24/7 support available for assistance</li>
                </ol>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 14px;">Thank you for choosing Care.xyz</p>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                For support: support@care.xyz | Phone: +880 1XXX-XXXXXX
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

// Generate confirmation HTML (simpler version)
function generateConfirmationHTML(booking) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 40px;">
    <h1 style="color: #0b4345; margin-top: 0;">Booking Confirmed! 🎉</h1>
    <p style="color: #333; font-size: 16px;">Dear ${booking.name},</p>
    <p style="color: #555;">Your booking for <strong>${booking.serviceName}</strong> has been confirmed.</p>
    
    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${booking._id.toString().slice(-8).toUpperCase()}</p>
      <p style="margin: 5px 0;"><strong>Duration:</strong> ${booking.duration} ${booking.durationType}</p>
      <p style="margin: 5px 0;"><strong>Total Cost:</strong> ৳${booking.totalCost.toLocaleString()}</p>
    </div>

    <p style="color: #555;">Our team will contact you shortly to finalize the details.</p>
    <p style="color: #555;">Thank you for choosing Care.xyz!</p>
  </div>
</body>
</html>
  `;
}

export default { sendInvoiceEmail, sendBookingConfirmationEmail };