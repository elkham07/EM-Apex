const nodemailer = require('nodemailer');

// Mock transporter for development
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass',
  },
});

exports.sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: '"EM Apex Team" <noreply@emapex.com>',
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}`, error);
  }
};
