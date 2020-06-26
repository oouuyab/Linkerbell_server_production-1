var express = require('express');
var app = express();
var sqlinjection = require('sql-injection');

const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require('./routes/users');
const linksRouter = require('./routes/links');

app.use(
  session({
    secret: '#linkerbell#',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(morgan('dev'));

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.use('/users', usersRouter, (req, res) => {});
app.use('/links', linksRouter);

app.listen(7000, function () {
  console.log('Example app listening on port!');
});

app.use((req, res, next) => {
  app.use(sqlinjection);
  console.log('serving request type' + req.method + 'for url' + req.url);
  const allowedOrigins = ['http://localhost:7000'];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET',
    'POST',
    'DELETE',
    'PATCH'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  return next();
});

module.exports = app;
