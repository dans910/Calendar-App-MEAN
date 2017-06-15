var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var session = require('express-session');
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
require('./models/models.js');
var api = require('./routes/api');
// var auth = require('./routes/auth')(passport);
var mongoose = require('mongoose');
//connect to mongods 
mongoose.connect('mongodb://localhost:27017/calendar', function(err, res){
  if(err){
    console.log("failed to connect to db");
  }else{
    console.log('connected to db');
  }

});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(session({
//   secret: 'secret',
//   saveUninitialized: true,
//   resave: true
// }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(passport.initialize());
// app.use(passport.session);

// app.use('/auth', auth);
app.use('/api', api);

//// Initialize Passport
// var initPassport = require('./passport.init');
// initPassport(passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
