//app.js
var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser') //Ajuda o acesso ao diferentes inputs do server
const methodOverride = require('method-override')//Permite usar o put e o delete

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');

const adminRouter = require('./routes/admin')
const usersRouter = require('./routes/users');
const doacoesRouter = require('./routes/doacoes');
const entidadesRouter = require('./routes/entidades');



//Ligacao ao mongoDB
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://drabori:12345@help.8rbtpcu.mongodb.net/?retryWrites=true&w=majority&appName=help' )
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout/layout');
app.use(expressLayouts);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))

app.use('/', authRouter);
app.use('/', indexRouter)

app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/doacoes', doacoesRouter);
app.use('/entidades', entidadesRouter);



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

