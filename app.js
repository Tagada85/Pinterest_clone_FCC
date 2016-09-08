var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const MongoStore = require('connect-mongo')(session);
const User = require('./models/User');

var routes = require('./routes/index');

var app = express();

const db = mongoose.connection;

mongoose.connect('mongodb://Tagada85:kallon85@ds021026.mlab.com:21026/pinterest_clone');
mongoose.Promise = global.Promise;

//initialize passport
app.use(passport.initialize());

//Restore Session
app.use(passport.session());

var sessionOptions = {
  secret: "this is a super secret dadada",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db
  })
};

app.use(session(sessionOptions));

//passport config

passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(userId, done){
  User.findById(userId, done);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);



/* SET Twitter Auth */

passport.use(new TwitterStrategy({
    consumerKey: 'GtaaoeqYxDrENiOgwJOsahQMB',
    consumerSecret: 'TnbrlsxnMfF67Hz39sem2TCLB9a013xJRQT16pCooWc08VQnou',
    callbackURL: "http://127.0.0.1:3000/auth/twitter/return"
  },
  function(token, tokenSecret, profile, cb) {
    User.findOneAndUpdate({ displayName: profile.displayName },
      {displayName: profile.displayName,
        username: profile.username},
      {upsert: true} ,
      cb );
  }
));

db.on("error", function(err){
  console.error("connection error:", err);
});

db.once("open", function(){
  console.log("db connection successful");
});

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


module.exports = app;
