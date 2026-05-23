const nodemailer = require('nodemailer');

// Set up mock sendMail mock function
const mockSendMail = jest.fn();
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: (...args) => mockSendMail(...args),
  }),
}));

const { sendEmail } = require('../services/emailService');

describe('Notification Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully send an email using nodemailer transporter', async () => {
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

    await sendEmail('worker@test.com', 'Welcome!', 'Welcome to EM Apex!');

    expect(mockSendMail).toHaveBeenCalledWith({
      from: '"EM Apex Team" <noreply@emapex.com>',
      to: 'worker@test.com',
      subject: 'Welcome!',
      text: 'Welcome to EM Apex!',
    });
  });

  it('should catch sendMail errors and log them without crashing', async () => {
    mockSendMail.mockRejectedValue(new Error('SMTP connection timed out'));

    await expect(sendEmail('worker@test.com', 'Failing', 'This will fail')).resolves.not.toThrow();
  });
});
