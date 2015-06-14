var express = require('express');
var router = express.Router();
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var common = require('./common/common');

var User = require('../models/db').User;

/**
 * Renders the login page.
 */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'JASMIC' });
});

/**
 * The endpoint to use to authenticate.
 */
router.post('/login',
    passport.authenticate('local', { successRedirect: '/home',
            failureRedirect: '/login' }
    )
);

/**
 * This is a simple check... first do a lookup for the user based
 * on the username. Compare the password store on the db with that
 * of the incoming password.
 */
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ us_username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.us_password != password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

/**
 * TODO: Need to ensure that user has the right privileges to do this
 */
router.post('/user', function(req, res) {
    var user = User(req.body);
    user.save(function(err, user) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            res.send(user);
        }
    })
});

module.exports = router;
