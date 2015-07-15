var express = require('express');
var CallLogs = require('./calls');
var router = express.Router();

/**
 * End Points relevant to CallLogs
 */
router.get('/calls/:id', CallLogs.getCallsByUserId);
router.post('/call', CallLogs.createCall);

module.exports = router;