var express = require('express'),
 path = require('path'),
 logger = require('morgan'),
 cookieParser = require('cookie-parser'),
 bodyParser = require('body-parser'),
 session = require('express-session'),
 passport = require('passport'),
 flash = require('connect-flash'),
 routes = require('./routes/index'),
 users = require('./routes/users'),
 farmer_routes = require('./routes/farmer/farmer_routes'),
 buyer_routes = require('./routes/buyer/buyer_routes'),
 supplier_routes = require('./routes/supplier/supplier_routes'),
 common_routes = require('./routes/common/common_routes'),
 transaction_routes = require('./routes/transaction/transaction-routes'),
 crop_routes = require('./routes/crop/crop_routes'),
 report_routes = require('./routes/reports/report_routes'),
 call_routes = require('./routes/calls/call_routes'),
 email_routes = require('./routes/email/email_routes'),
 model = require('./models/db'),
 app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
//app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', farmer_routes);
app.use('/', buyer_routes);
app.use('/', supplier_routes);
app.use('/', crop_routes);
app.use('/', transaction_routes);
app.use('/', routes);
app.use('/', users);
app.use('/', report_routes);
app.use('/', call_routes);
app.use('/common', common_routes);
app.use('/', email_routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


module.exports = app;
