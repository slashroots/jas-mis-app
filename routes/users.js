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
 *
 * The function also has a default admin password that can only be
 * set if a user has physical access to the infrastructure's
 * environmental variables.
 */
passport.use(new LocalStrategy(
    function(username, password, done) {
        if((username == process.env.DEFAULT_USER) && (password == process.env.DEFAULT_PASS)) {
            var user = {
                us_user_first_name: "Easter",
                us_user_last_name: "Bunny",
                us_username: "admin",
                us_password: "21232f297a57a5a743894a0e4a801fc3",
                ut_user_type: "Administrator",
                us_email_address: "admin@admin.com",
                us_contact: "NONE"
            };
            return done(null, user);
        } else {
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
    }
));

/**
 * If the user is an authenticated administrator, he or she has the ability to create
 * a user.
 */
router.post('/user', function(req, res) {
    if(common.isAdmin(req, res)) {
        var user = User(req.body);
        user.save(function (err, user) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                res.send(user);
            }
        });
    }
});

/**
 * The intention is to use this as a "who am I..."
 * After the user logs in. They can get their profile
 * based on just the session!
 */
router.get('/user', function(req, res) {
    if(common.isAuthenticated(req, res)) {
        userValue = req.user;
        userValue.password = "";
        res.send(userValue);
    }
});


module.exports = router;
