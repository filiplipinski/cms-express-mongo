const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to DB'));

const indexRouter = require('./routes/index');
const newsRouter = require('./routes/news');
const quizRouter = require('./routes/quiz');
const adminRouter = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
// cookieSession dodaje obiekt session do 'req'
app.use(cookieSession({
  name: 'adminSession',
  keys: config.keySession,
  maxAge: config.maxAgeSesion
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // tworze zmienna globalna 'path' w localsach
  res.locals.path = req.path;
  next();
});

app.use('/', indexRouter);
app.use('/news', newsRouter);
app.use('/quiz', quizRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;