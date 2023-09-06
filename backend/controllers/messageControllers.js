const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {sendMessage, allMessages, updateNotifications} = require('../services/messageServices')

router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, allMessages);
router.route('/notification').put(protect, updateNotifications);

module.exports = router;