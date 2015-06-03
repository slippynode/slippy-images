var localStrategy = require('passport-local').Strategy
  , db = require('./database')
;

function authenticate (passport) {

  var params = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  };

  function register (req, username, password, callback) {
    new database.Users({ username: username }).fetch()
      .then(function (model) {
        if (model) return callback(new Error("User exists!"));
        var data = {
          username: username,
          email: req.body.email,
          password: this.generateHash(password)
        };
        new database.Users(data).save()
          .then(function (newModel) { return callback(null, newModel); })
          .catch(function (error) { return callback(error); })
        ;
      })
      .catch(function (error) {
        return callback(error);
      })
    ;
  }

  function login (req, username, password, callback) {
    new database.Users({ username: username }).fetch()
      .then(function (model) {
        if (!model) {
          return callback(null, new Error("User doesn't exist!"));
        }
        if (!model.validPassword(password)) {
          return callback(null, new Error("Password incorrect!"));
        }
        return callback(null, model);
      })
      .catch(function (error) {
        return callback(error);
      })
    ;
  }

  passport.serializeUser(function (user, callback) {
    callback(null, user.id);
  });

  passport.use('register', new localStrategy(params, register);

  passport.use('login', new localStrategy(params, login);

};

module.exports = authenticate;