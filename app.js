var express = require('express')
var app = express()

const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')

const morgan = require('morgan');

const usersRouter = require('./routes/users')
//const linksRouter = require('./routes/links')

app.use(
  session({
    secret: '#linkerbell#',
    resave: false,
    saveUninitialized: true
  })
)

app.use(cookieParser())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  cors({
    origin: ['http://13.125.223.179:7000'],
    methods: ['GET', 'POST'],
    credentials: true
  })
)

app.use(morgan('dev'));

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.use('/users', usersRouter)
//app.use('/links', linksRouter)

app.listen(7000, function () {
  console.log('Example app listening on port!')
})

module.exports = app;
