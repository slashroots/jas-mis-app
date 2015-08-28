var express = require('express');
var CallLogs = require('./calls');
var router = express.Router();

/**
 * End Points relevant to CallLogs and 
 * Call Types.
 */
router.get('/calls', CallLogs.searchCalls);
router.post('/call', CallLogs.createCall);
router.get('/calltypes', CallLogs.getCallTypes);
router.post('/calltype', CallLogs.createCallType);


module.exports = router;