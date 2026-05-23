const { processPayment, getWorkerPayments } = require('../controllers/paymentController');
const Payment = require('../models/Payment');
const { getNats } = require('../config/nats');

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockReturnValue({});
});

// Mock Payment Model
jest.mock('../models/Payment', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
}));

// Mock NATS Client
jest.mock('../config/nats', () => ({
  getNats: jest.fn().mockReturnValue({
    publish: jest.fn(),
  }),
}));

describe('Payment Service Controllers', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('Process Payment (NATS Event handler)', () => {
    it('should successfully create pending payment, complete it, and publish NATS payment.completed event', async () => {
      const mockData = {
        submissionId: 'sub-uuid',
        workerId: 'worker-uuid',
        taskId: 'task-uuid',
      };

      const mockSave = jest.fn().mockResolvedValue(true);
      const mockPaymentInstance = {
        id: 'payment-uuid',
        submissionId: 'sub-uuid',
        workerId: 'worker-uuid',
        amount: 15.00,
        status: 'pending',
        save: mockSave,
      };

      Payment.create.mockResolvedValue(mockPaymentInstance);

      await processPayment(mockData);

      expect(Payment.create).toHaveBeenCalledWith({
        submissionId: 'sub-uuid',
        workerId: 'worker-uuid',
        amount: 15.00,
        status: 'pending',
      });

      expect(mockPaymentInstance.status).toBe('completed');
      expect(mockPaymentInstance.stripeChargeId).toBe('ch_mock_12345');
      expect(mockSave).toHaveBeenCalled();

      // Verify NATS event published
      const mockNats = getNats();
      expect(mockNats.publish).toHaveBeenCalledWith(
        'payment.completed',
        expect.any(Uint8Array)
      );
    });

    it('should handle payment errors gracefully without throwing', async () => {
      const mockData = { submissionId: 'sub-uuid' };
      Payment.create.mockRejectedValue(new Error('Stripe declined'));

      // Should log error but not crash/throw (since processPayment catches internally)
      await expect(processPayment(mockData)).resolves.not.toThrow();
    });
  });

  describe('Get Worker Payments', () => {
    it('should successfully fetch all payments for a specific worker', async () => {
      req.params = { workerId: 'worker-uuid' };
      const workerPayments = [
        { id: 'p1', amount: 15.00, status: 'completed' },
        { id: 'p2', amount: 30.00, status: 'completed' },
      ];
      Payment.findAll.mockResolvedValue(workerPayments);

      await getWorkerPayments(req, res);

      expect(Payment.findAll).toHaveBeenCalledWith({ where: { workerId: 'worker-uuid' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(workerPayments);
    });

    it('should return 500 when database query fails during fetch', async () => {
      req.params = { workerId: 'worker-uuid' };
      Payment.findAll.mockRejectedValue(new Error('Connection failed'));

      await getWorkerPayments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
