var express = require('express');
var moment = require('moment');
var router = express.Router();


/* GET home page. */

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'JASMIC' });
});
/**
 * Redirects user once the application's root is
 * encountered.
 */
router.get('/', function(req, res){
	res.redirect('/login');
});

/**
 * Redirects user to login page.
 */
router.get('/', function(req, res){
  res.redirect('/login');
});

router.get('/user/:id', function(req, res){
  res.render('user');
});


module.exports = router;
