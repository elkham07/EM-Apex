const { updateProfileXP, getProfile } = require('../controllers/profileController');
const Profile = require('../models/Profile');

// Mock Profile Model
jest.mock('../models/Profile', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe('Profile Service Controllers', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('Update Profile XP (NATS Handler)', () => {
    it('should successfully update existing worker profile with new XP and earnings', async () => {
      const mockData = { workerId: 'worker-uuid', amount: 150.00 };
      const mockSave = jest.fn().mockResolvedValue(true);
      const mockProfileInstance = {
        workerId: 'worker-uuid',
        totalEarnings: 100.00,
        xp: 500,
        level: 1,
        save: mockSave,
      };

      Profile.findOne.mockResolvedValue(mockProfileInstance);

      await updateProfileXP(mockData);

      expect(Profile.findOne).toHaveBeenCalledWith({ where: { workerId: 'worker-uuid' } });
      expect(mockProfileInstance.totalEarnings).toBe(250.00);
      expect(mockProfileInstance.xp).toBe(2000); // 500 + 150*10 = 2000
      expect(mockProfileInstance.level).toBe(3); // 2000 / 1000 + 1 = 3
      expect(mockSave).toHaveBeenCalled();
    });

    it('should create a new profile if none exists, then update it', async () => {
      const mockData = { workerId: 'new-worker-uuid', amount: 50.00 };
      const mockSave = jest.fn().mockResolvedValue(true);
      const mockProfileInstance = {
        workerId: 'new-worker-uuid',
        totalEarnings: 0.00,
        xp: 0,
        level: 1,
        save: mockSave,
      };

      Profile.findOne.mockResolvedValue(null);
      Profile.create.mockResolvedValue(mockProfileInstance);

      await updateProfileXP(mockData);

      expect(Profile.findOne).toHaveBeenCalledWith({ where: { workerId: 'new-worker-uuid' } });
      expect(Profile.create).toHaveBeenCalledWith({ workerId: 'new-worker-uuid' });
      expect(mockProfileInstance.totalEarnings).toBe(50.00);
      expect(mockProfileInstance.xp).toBe(500);
      expect(mockProfileInstance.level).toBe(1);
      expect(mockSave).toHaveBeenCalled();
    });

    it('should catch errors and log them without throwing', async () => {
      const mockData = { workerId: 'worker-uuid', amount: 50.00 };
      Profile.findOne.mockRejectedValue(new Error('DB Lock'));

      await expect(updateProfileXP(mockData)).resolves.not.toThrow();
    });
  });

  describe('Get Profile', () => {
    it('should successfully return the profile if it exists', async () => {
      req.params = { workerId: 'worker-uuid' };
      const mockProfile = { workerId: 'worker-uuid', totalEarnings: 120.00, xp: 1200, level: 2 };
      Profile.findOne.mockResolvedValue(mockProfile);

      await getProfile(req, res);

      expect(Profile.findOne).toHaveBeenCalledWith({ where: { workerId: 'worker-uuid' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProfile);
    });

    it('should return a default profile outline if no profile is found in DB', async () => {
      req.params = { workerId: 'empty-worker-uuid' };
      Profile.findOne.mockResolvedValue(null);

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        workerId: 'empty-worker-uuid',
        totalEarnings: 0,
        xp: 0,
        level: 1,
      });
    });

    it('should return 500 when query fails during profile fetch', async () => {
      req.params = { workerId: 'worker-uuid' };
      Profile.findOne.mockRejectedValue(new Error('Connection lost'));

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
