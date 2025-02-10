const express = require('express');
const router = express.Router();
const memberController = require('../Controller/subscriberController');

router.post('/subscribe', memberController.subscribeWithStripe);
router.post('/save-member', memberController.saveSubscriberToDb);

module.exports = router;