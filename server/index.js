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

server.listen(server.get('port'), function () {
  var host = this.address().address;
  var port = this.address().port;
  console.log('Listening at http://%s:%s', host, port);
});