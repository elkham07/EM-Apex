const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Upload task files (PDF brief)
router.post('/upload', verifyToken, isAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `/api/tasks/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

router.post('/', verifyToken, isAdmin, taskController.createTask);
router.get('/', verifyToken, taskController.getAllTasks);
router.put('/:id', verifyToken, isAdmin, taskController.updateTask);
router.delete('/:id', verifyToken, isAdmin, taskController.deleteTask);

module.exports = router;
