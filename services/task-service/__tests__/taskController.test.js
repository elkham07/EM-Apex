const { createTask, getAllTasks } = require('../controllers/taskController');
const Task = require('../models/Task');

// Mock Task Model
jest.mock('../models/Task', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
}));

describe('Task Service Controllers', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('Create Task', () => {
    it('should successfully create a new task', async () => {
      req.body = {
        title: 'New Design task',
        description: 'Create a UI screen',
        reward: 50.00,
        createdBy: 'admin-uuid',
      };
      Task.create.mockResolvedValue({
        id: 'task-uuid',
        title: 'New Design task',
        description: 'Create a UI screen',
        reward: 50.00,
        createdBy: 'admin-uuid',
        status: 'active',
      });

      await createTask(req, res);

      expect(Task.create).toHaveBeenCalledWith({
        title: 'New Design task',
        description: 'Create a UI screen',
        reward: 50.00,
        createdBy: 'admin-uuid',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Task created successfully',
        task: {
          id: 'task-uuid',
          title: 'New Design task',
          description: 'Create a UI screen',
          reward: 50.00,
          createdBy: 'admin-uuid',
          status: 'active',
        },
      });
    });

    it('should handle internal errors gracefully', async () => {
      req.body = { title: 'Broken task' };
      Task.create.mockRejectedValue(new Error('DB Error'));

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('Get All Active Tasks', () => {
    it('should successfully fetch all active tasks', async () => {
      const activeTasks = [
        { id: 't1', title: 'Task 1', status: 'active' },
        { id: 't2', title: 'Task 2', status: 'active' },
      ];
      Task.findAll.mockResolvedValue(activeTasks);

      await getAllTasks(req, res);

      expect(Task.findAll).toHaveBeenCalledWith({ where: { status: 'active' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(activeTasks);
    });

    it('should handle database errors during fetch gracefully', async () => {
      Task.findAll.mockRejectedValue(new Error('Connection lost'));

      await getAllTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
