var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    common = require('./common/common'),
    User = require('../models/db').User;

/**
 * Renders the login page.
 */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'JASMIC', goTo: req.query.goTo});
});

/**
 * The endpoint to use to authenticate.
 */
router.post('/login', function(req, res, next){
    if(req.query.goTo) {
        passport.authenticate('local', { successRedirect: req.query.goTo,
                failureRedirect: '/login' }
        )(req, res, next);
    } else {
        passport.authenticate('local', { successRedirect: '/home',
                failureRedirect: '/login' }
        )(req, res, next);
    }
});

/**
 * Endpoint for logging out.
 * TODO: Revisit the info message!
 */
router.get('/logout', function(req, res) {
    req.logout();
    res.send({info: "Complete!"});
});

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
                ut_user_type: "Administrator",
                us_email_address: "admin@admin.com",
                us_contact: "NONE"
            };
            return done(null, user);
        } else {
            User.findOne({ us_username: username, us_state: 'approved' }, function(err, user) {
                if (err || !user){
                  return done(null, false, { message: 'Incorrect username or password' });
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
        createUser(req.body, 'approved', res);
    }
});
/**
 * Registers a new user.
 */
router.post('/register', function(req, res){
   createUser(req.body, 'pending', res);
});
/**
 * Creates a new user.
 * @param  {Object} user   Details of a user.
 * @param  {String} state The state of the user.
 * TODO - determine if the user object should be returned after creation.
 */
function createUser(user, state, res){
    var user = new User(user),
        result = false;
    user.us_state = state;
    user.us_username = user.us_email_address.substring(0,user.us_email_address.indexOf('@'));
    user.save(function(err){
      if(err){
        common.handleDBError(err, res);
      }else{
         res.send(user);
      }
    });
};
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
/**
 * Retrieves all users from database.
 * @param req
 * @param res
 */
router.get('/users', function(req, res){
   if(common.isAdmin(req, res)){
       User.find(function(err, users){
           if(err || !users){
                common.handleDBError(err, res);
           }else{
              res.send(users);
           }
       });
   }
});
/**
 * Updates a user's record. Requires administrative privileges.
 * @param req
 * @param res
 */
router.put('/user/:id', function(req, res){
    if(common.isAdmin(req, res)){
        User.findByIdAndUpdate(req.params.id, req.body,function(err,doc){
            if(err || !doc){
                common.handleDBError(err, res);
            }else{
                res.send(doc);
            }
        });
    }
});


module.exports = router;
