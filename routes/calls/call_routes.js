var express = require('express');
var CallLogs = require('./calls');
var router = express.Router();

/**
 * End Points relevant to CallLogs
 */
router.get('/calls', CallLogs.searchCalls);
router.post('/call', CallLogs.createCall);

module.exports = router;