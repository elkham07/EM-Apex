const { submitWork, reviewSubmission } = require('../controllers/submissionController');
const Submission = require('../models/Submission');
const { getNats } = require('../config/nats');

// Mock Submission Model
jest.mock('../models/Submission', () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
}));

// Mock NATS Client
jest.mock('../config/nats', () => ({
  getNats: jest.fn().mockReturnValue({
    publish: jest.fn(),
  }),
}));

describe('Submission Service Controllers', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('Submit Work', () => {
    it('should successfully submit work and publish submission.created event', async () => {
      req.body = {
        taskId: 'task-uuid',
        workerId: 'worker-uuid',
        fileUrl: 'http://work.drive.com/file',
      };
      
      const mockSubmission = {
        id: 'submission-uuid',
        taskId: 'task-uuid',
        workerId: 'worker-uuid',
        fileUrl: 'http://work.drive.com/file',
        status: 'pending',
      };
      Submission.create.mockResolvedValue(mockSubmission);

      await submitWork(req, res);

      expect(Submission.create).toHaveBeenCalledWith({
        taskId: 'task-uuid',
        workerId: 'worker-uuid',
        fileUrl: 'http://work.drive.com/file',
      });
      
      // Verify NATS publishing
      const mockNats = getNats();
      expect(mockNats.publish).toHaveBeenCalledWith(
        'submission.created',
        expect.any(Uint8Array)
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Work submitted successfully',
        submission: mockSubmission,
      });
    });

    it('should handle internal errors gracefully on submit', async () => {
      req.body = { taskId: 't1' };
      Submission.create.mockRejectedValue(new Error('Database full'));

      await submitWork(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('Review Submission', () => {
    it('should successfully approve submission and publish submission.approved event', async () => {
      req.params = { id: 'submission-uuid' };
      req.body = { status: 'approved' };

      const mockSave = jest.fn().mockResolvedValue(true);
      const mockSubmissionInstance = {
        id: 'submission-uuid',
        taskId: 'task-uuid',
        workerId: 'worker-uuid',
        status: 'pending',
        save: mockSave,
      };
      Submission.findByPk.mockResolvedValue(mockSubmissionInstance);

      await reviewSubmission(req, res);

      expect(Submission.findByPk).toHaveBeenCalledWith('submission-uuid');
      expect(mockSubmissionInstance.status).toBe('approved');
      expect(mockSave).toHaveBeenCalled();

      // Verify NATS publishing for approved
      const mockNats = getNats();
      expect(mockNats.publish).toHaveBeenCalledWith(
        'submission.approved',
        expect.any(Uint8Array)
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Submission approved successfully',
        submission: mockSubmissionInstance,
      });
    });

    it('should successfully reject submission without publishing submission.approved', async () => {
      req.params = { id: 'submission-uuid' };
      req.body = { status: 'rejected' };

      const mockSave = jest.fn().mockResolvedValue(true);
      const mockSubmissionInstance = {
        id: 'submission-uuid',
        taskId: 'task-uuid',
        workerId: 'worker-uuid',
        status: 'pending',
        save: mockSave,
      };
      Submission.findByPk.mockResolvedValue(mockSubmissionInstance);

      await reviewSubmission(req, res);

      expect(mockSubmissionInstance.status).toBe('rejected');
      expect(mockSave).toHaveBeenCalled();

      const mockNats = getNats();
      expect(mockNats.publish).not.toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Submission rejected successfully',
        submission: mockSubmissionInstance,
      });
    });

    it('should return 404 if submission is not found', async () => {
      req.params = { id: 'nonexistent-uuid' };
      req.body = { status: 'approved' };
      Submission.findByPk.mockResolvedValue(null);

      await reviewSubmission(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Submission not found' });
    });
  });
});
