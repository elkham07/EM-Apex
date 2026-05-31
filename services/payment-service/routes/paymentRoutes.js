const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/worker/:workerId', paymentController.getWorkerPayments);
router.get('/', paymentController.getAllPayments);

module.exports = router;
