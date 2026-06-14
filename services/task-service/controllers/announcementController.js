const Announcement = require('../models/Announcement');

// GET /api/announcements — return all announcements, newest first
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/announcements — create a new announcement
const createAnnouncement = async (req, res) => {
  try {
    const { text, sentBy } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Text is required' });
    }
    const announcement = await Announcement.create({
      text: text.trim(),
      sentBy: sentBy || 'Admin',
    });
    res.status(201).json(announcement);
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/announcements/:id — delete an announcement by ID
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    await announcement.destroy();
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    console.error('Error deleting announcement:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement };
