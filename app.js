const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// the HTTP routes
const indexRouter = require('./routes/index');
const actorsRouter = require('./routes/actors');
const actorRouter = require('./routes/actor');
const activitiesRouter = require('./routes/activities');
const activityRouter = require('./routes/activity');
const apiRouter = require('./routes/api');

// the app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// the HTTP routes
app.use('/', indexRouter);
app.use('/actors', actorsRouter);
app.use('/actor', actorRouter);
app.use('/activities', activitiesRouter);
app.use('/activity', activityRouter);
app.use('/api', apiRouter);

// initialize the world model
const initializer = require('./lib/initializer');
initializer.init();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
