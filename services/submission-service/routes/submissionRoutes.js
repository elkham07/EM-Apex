const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { verifyToken } = require('../middleware/authMiddleware');
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

// Upload submission work files (PDF, ZIP, DOC, DOCX)
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `/api/submissions/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

router.post('/', verifyToken, submissionController.submitWork);
router.put('/:id/review', verifyToken, submissionController.reviewSubmission);
router.get('/', verifyToken, submissionController.getAllSubmissions);
router.get('/worker/:workerId', verifyToken, submissionController.getWorkerSubmissions);
router.delete('/:id', verifyToken, submissionController.deleteSubmission);

module.exports = router;
