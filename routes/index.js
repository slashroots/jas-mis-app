var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'JASMIC' });
});

//get report page 
router.get('/report', function(req, res, next){
	console.log("Body " + req.query.demand);
	res.render('report', {title: 'Report'});
});


module.exports = router;
