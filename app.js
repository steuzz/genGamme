var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');

var main = require('./routes/main');
var admin = require('./routes/admin');
var addDB = require('./routes/addDB');
var modifDB = require('./routes/modifDB');

hbs.registerPartials(__dirname + '/views/partials', function() {
  console.log('partials registered');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', main);
app.use('/ad', admin);
app.use('/addDB', addDB);
app.use('/modifDB', modifDB);

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

hbs.registerHelper('arrayToString', function (value, options) {
  console.log('value: ', value);
  var length = value.length;
  var str = "";
  for (let i = 0; i < length; i++) {
    if (i == length-1) {
      str += value[i];
    } else {
      str += value[i] + ",";
    }
  }
  console.log('str: ', str);
  if (str) return str;
});

module.exports = app;