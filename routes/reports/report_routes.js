/**
 * Created by matjames007 on 7/13/15.
 */
var express = require('express');
var moment = require('moment');
var router = express.Router();
var reports = require('./reports');


router.post('/report/buyer_report', reports.constructReport);

module.exports = router;