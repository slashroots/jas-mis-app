var express = require('express');
var moment = require('moment');
var router = express.Router();
var NewUser = require('../models/db').NewUser,
    User = require('../models/db').User;


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

/**
 *  Get new user registration page.
 */
router.get('/register', function(req, res){
    res.render('register', {title: 'JASMIC'});
});

module.exports = router;
