var knex = require('../db.js');
var follower = require('./follower.js');
var util = require('../../server/utilities');

exports.getUser = function(username) {
  return knex('users')
    .where('username', username)
    .then(result => {
      return result[0];
    })
    .then(user => {
      return follower.getFollowers(user.id)
        .then(results => {
          var getFollowers = results.map(result => {
            return (exports.getUserById(result.follower_id));
          });

          return Promise.all(getFollowers)
            .then(function(followers) {
              user.followers = followers.map(follower => follower.username);
              return user;
            });
        });
    });
};

exports.getUserById = function(id) {
  return knex('users')
    .where('id', id)
    .then(result => {
      return _.pick(result[0], ['id', 'user', 'username']);
    })
    .then(user => {
      return follower.getFollowers(user.id)
        .then(results => {
          var getFollowers = results.map(result => {
            return (exports.getUserById(result.follower_id));
          });

          return Promise.all(getFollowers)
            .then(function(followers) {
              user.followers = followers.map(follower => follower.username);
              return user;
            });
        });
    });
};

exports.getUsers = function(query) {
  return knex('users')
    .where('username', 'LIKE', query + '%')
    .then(result => {
      return result.map((user) => {
        // don't return passwords
        return _.pick(user, ['id', 'user', 'username']);
      });
    });
};

exports.insertUser = function(user, username, password) {
  return util.hashPasswordAsync(password)
    .then(hash => {
      return knex('users')
        .returning(['id', 'user', 'username'])
        .insert({ user: user, username: username, password: hash })
        .then(result => {
          return result[0];
        });
    });
};
