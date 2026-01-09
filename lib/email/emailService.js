import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send booking confirmation email
export async function sendBookingConfirmationEmail({
  to,
  customerName,
  bookingId,
  serviceName,
  duration,
  totalCost,
  location,
  date,
  phone,
}) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"CareNest" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Booking Confirmed - ${serviceName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 3px solid #a3c4e0;">
              <h1 style="color: #2b6f7a; margin: 0;">🎉 CareNest</h1>
              <div style="background: #10b981; color: white; padding: 10px 20px; border-radius: 50px; display: inline-block; margin: 20px 0; font-weight: bold;">✓ Booking Confirmed</div>
            </div>

            <p style="font-size: 16px; margin-top: 20px;">Dear <strong>${customerName}</strong>,</p>
            <p>Thank you for choosing CareNest! We're delighted to confirm your booking.</p>

            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #2b6f7a; margin-top: 0;">Booking Details</h2>
              <p><strong>Booking ID:</strong> #${bookingId.slice(-8).toUpperCase()}</p>
              <p><strong>Service:</strong> ${serviceName}</p>
              <p><strong>Duration:</strong> ${duration}</p>
              <p><strong>Location:</strong> ${location}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Contact:</strong> ${phone}</p>
            </div>

            <div style="background: linear-gradient(135deg, #a3c4e0, #7aabb8); color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold;">
              Total Amount: ৳${totalCost.toLocaleString()}
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; font-size: 14px;">
              <p><strong>Need help?</strong><br>Contact us at support@carenest.com or call +880 1234-567890</p>
              <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} CareNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    throw error;
  }
}

// Send invoice email
export async function sendInvoiceEmail({ to, booking, payment }) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"CareNest" <${process.env.EMAIL_USER}>`,
      to,
      subject: `💳 Payment Receipt & Invoice - ${booking.serviceName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 3px solid #10b981;">
              <h1 style="color: #059669; margin: 0;">💳 CareNest</h1>
              <div style="background: #10b981; color: white; padding: 10px 20px; border-radius: 50px; display: inline-block; margin: 20px 0; font-weight: bold;">✓ Payment Successful</div>
            </div>

            <p style="font-size: 16px; margin-top: 20px;">Dear <strong>${booking.name}</strong>,</p>
            <p>Thank you for your payment! This confirms that we have successfully received your payment.</p>

            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #059669; margin-top: 0;">Invoice Details</h2>
              <p><strong>Invoice Number:</strong> #${booking._id.toString().slice(-8).toUpperCase()}</p>
              <p><strong>Payment Date:</strong> ${new Date(payment.paidAt).toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> ${payment.paymentMethod.toUpperCase()}</p>
              <p><strong>Transaction ID:</strong> ${payment.stripePaymentIntentId}</p>
            </div>

            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; font-size: 28px; font-weight: bold;">
              Total Amount Paid: ৳${booking.totalCost.toLocaleString()}
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; font-size: 14px;">
              <p><strong>Need help?</strong><br>Contact us at support@carenest.com or call +880 1234-567890</p>
              <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} CareNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Invoice email sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('❌ Invoice email send failed:', error.message);
    throw error;
  }
}