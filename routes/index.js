var express = require('express');
var moment = require('moment');
var router = express.Router();


/* GET home page. */

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'JASMIC' });
});

/**
 * Redirects user to login page.
 */
router.get('/', function(req, res){
  res.redirect('/login');
});


module.exports = router;
