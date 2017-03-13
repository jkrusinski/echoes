var express = require('express');
var router = express.Router();
var path = require('path');
var knex = require('knex');
var bcrypt = require('bcrypt');
var saltRounds = 10;


// get requests served static signup file
router.get('/signup', function (req, res) {
  res.sendFile(path.join(__dirname, '/../../client/signup.html'));
});

// post requests add user to the database and begin session
router.post('/signup', function (req, res) {
  // get username and password from request body
  var name = req.body.name;
  var username = req.body.username;
  var password = req.body.password;
  // knex query to search database for user
  var query = knex('user').where('username', username);




  if (query) {
    res.status(401).send('This username has already been taken.');
  } else {
    // Hash password with bcrypt before executing the following knex insert statement


   bcrypt.genSalt(saltRounds, function(err, salt) {
       bcrypt.hash(password, salt, null, function(err, hash) {
           // Store hash in your password DB.
          knex('user').returning(['id', 'name', 'username']).insert({name: name, username: username, password: hash});
       });
   });

    // log them in

  }
});

module.exports = router;