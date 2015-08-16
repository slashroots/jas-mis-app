var express = require('express');
var moment = require('moment');
var router = express.Router();
var NewUser = require('../models/db').NewUser;


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
 * Performs a query on the new user table to determine if user
 * still exists.
 * @param req
 * @param res
 */
router.get('/user/:id/new', function(req, res){
  NewUser.findById(req.params.id, function(err, user){
    if(err || !user){
      res.render('user', {found: false, title: 'New User'});
    }else{
      res.render('user', {found: true, title: 'New User'});
    }
  });
});


module.exports = router;
