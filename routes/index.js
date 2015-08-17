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
      res.render('user', {found: true, title: 'New User', id: req.params.id});
    }
  });
});

/**
 * Creates a new user once the new user has successfully
 * updated default password.
 * TODO - Get original password from record and compare to
 * new password.
 */
router.post('/user/:id/confirm', function(req, res){
  NewUser.findById(req.params.id, function(err, new_user){
    if(err || !new_user){
      res.redirect('/user/'+req.params.id+'/new', {found: false});
    }else{
      var user = new User(new_user);
      user.us_password = req.body.password;
      user.us_verified = "Verified";
      user.save(function(err){
        if(err){
          res.redirect('/user/'+req.params.id+'/new', {found: false});
        }else{
          res.redirect('/login');
        }
      });
    }
  });
  //NewUser.findById(req.params.id, {$set: {us_status: "Verified", us_password: req.body.password}}, function(err, result){
  //  if(err || !result){
  //    res.redirect('/user/'+req.params.id+'/new', {found: false});
  //  }else{
  //    new User()
  //    res.redirect('/login');
  //  }
  //});
});

module.exports = router;
