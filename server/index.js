var express = require('express')
  , cookieParser = require('cookie-parser')
  , session = requrie('express-session')
  , bodyParser = require('body-parser')
  , passport = require('passport')
  , routes = require('./routes')
  , server = express();
;

server.set('port', process.env.PORT || 3030);

server.use(cookieParser('secret'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json({ limit: '25mb' }));

require('./passport')(passport);

server.use(session({ secret: 'secret' }));
server.use(passport.initialize());
server.use(passport.session());

function checkAuthorization (req, res, next) {
  if (req.isAuthenticated && req.user.id) return next();
  else res.status(401).end();
}

// Login & Logout Routes =======================================================
server.post('/users/login/',
  passport.authenticate('login'),
  function (req, res, next) {
    res.status(200).end();
  })
;

server.post('/users/logout/',
  checkAuthorization,
  function (req, res, next) {
    req.logout();
    res.status(200).end();
  })
;

// User Routes =================================================================
server.get('/users/:username/',
  function (req, res, next) {
    return next();
  }, routes.getUser)
;

server.get('/users/:username/submissions/',
  function (req, res, next) {
    return next();
  }, routes.getUserSubmissions)
;

server.get('/users/:username/comments/',
  function (req, res, next) {
    return next();
  }, routes.getUserComments)
;

server.get('/users/:username/likes/',
  function (req, res, next) {
    return next();
  }, routes.getUserLikes)
;

server.get('/users/:username/dislikes/',
  function (req, res, next) {
    return next();
  }, routes.getUserDislikes)
;

server.get('/users/:username/saves/',
  function (req, res, next) {
    return next();
  }, routes.getUserSaves)
;

server.post('/users/register/',
  passport.authenticate('register'),
  function (req, res, next) {
    res.send(req.user);
  })
;

server.put('/users/:username/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.updateUser)
;

server.delete('/users/:username/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.deleteUser)
;

// Submissions Routes ==========================================================
server.get('/submissions/',
  function (req, res, next) {
    return next();
  }, routes.getSubmissions)
;

server.get('/submissions/:submission/',
  function (req, res, next) {
    return next();
  }, routes.getSubmission)
;

server.post('/submissions/',
  function (req, res, next) {
    return next();
  }, routes.createSubmission)
;

server.put('/submissions/:submission/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.updateSubmission)
;

server.delete('/submissions/:submission/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.deleteSubmission)
;

// Tags Routes =================================================================
server.get('/tags/',
  function (req, res, next) {
    return next();
  }, routes.getTags)
;

server.listen(server.get('port'), function () {
  var host = this.address().address;
  var port = this.address().port;
  console.log('Listening at http://%s:%s', host, port);
});