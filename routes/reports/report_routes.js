/**
 * Created by matjames007 on 7/13/15.
 */
var express = require('express');
var router = express.Router();
var reports = require('./reports');


router.post('/report', reports.createReport);
router.get('/report/:id', reports.renderReport);
router.get('/reports', reports.searchReports);

module.exports = router;