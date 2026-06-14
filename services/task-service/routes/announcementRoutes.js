const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', announcementController.getAnnouncements);
router.post('/', verifyToken, isAdmin, announcementController.createAnnouncement);
router.delete('/:id', verifyToken, isAdmin, announcementController.deleteAnnouncement);

module.exports = router;
