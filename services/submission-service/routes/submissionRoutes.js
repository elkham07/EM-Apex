const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

router.post('/', submissionController.submitWork);
router.put('/:id/review', submissionController.reviewSubmission);
router.get('/', submissionController.getAllSubmissions);
router.get('/worker/:workerId', submissionController.getWorkerSubmissions);

module.exports = router;
