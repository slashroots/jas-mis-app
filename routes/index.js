var express = require('express');
var router = express.Router();
var common = require('./common/common');

/* GET home page. */
router.get('/home', function(req, res, next) {
	if(common.isAuthenticated(req, res)){
		res.render('index', { title: 'JASMIC' });
	}//else{
	// 	common.redirect(req, res, 'login');
	// }
});

module.exports = router;
