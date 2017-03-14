//DEPENDENCIES
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var pg = require('pg');
var session = require('express-session');
var db = require('../db/db.js')
var app = express();

// ROUTE MODULE DEPENDENCIES
var appServer = require('./routes/appRoutes.js');
var authServer = require('./routes/authRoutes.js');
var newUserServer = require('./routes/newUserRoutes.js');
var dbServer = require('./routes/dbRoutes.js');
var logoutServer = require('./routes/logoutRoute.js');

// MIDDLEWARE
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use('/public', express.static(path.join(__dirname, '/../client')));

// SESSION
app.use(session({
  secret: '666',
  resave: false,
  saveUninitialized: true
}));

// ROUTERS
app.use('/', appServer);
app.use('/querydb', dbServer);
app.use('/signin', authServer);
app.use('/signup', newUserServer);
app.use('/signout', logoutServer);
app.use(function (req, res, next) {
  res.status(404).send('Sorry--we can\'t find that')
});

// LISTENER
app.listen(1337, function () {
  console.log('Satan is listening on port 1337.')
});
