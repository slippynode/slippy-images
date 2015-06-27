var fs = require('fs')
  , async = require('async')
  , path = require('path')
  , exec = require('child_process').exec
  , supertest = require('supertest')
  , server
  , agent
  , half
  , userImages
  , anonImages
  , images
  , imagesDirectory
;


function before (done) {
  var cmd = 'createdb -O slippyimages_user slippyimages_db -E utf8';
  cmd += ' && psql -d slippyimages_db -f slippy-images.sql';
  imagesDirectory = './utilities/sample-images/'
  exec(cmd, function (error, stdout, stderr) {
    if (error) throw error;
    if (stderr) throw stderr;
    require('../server')(function (server) {
      server = server;
      agent = supertest.agent(server);
      fs.readdir(imagesDirectory, function (error, files) {
        if (error) throw error;
        images = files.map(function (x) {
          return path.join(imagesDirectory, x);
        });
        half = Math.ceil(images.length / 2);
        userImages = images.splice(0, half);
        anonImages = images;
        done();
      });
    });
  });
}

function anonymousLoader (files, done) {
  async.eachSeries(files, function (file, callback) {
    agent
      .post('/submissions/')
      .field('title', 'This is a title')
      .field('caption', 'This is a caption')
      .field('private', 'false')
      .field('anonymous', 'true')
      .attach('file', file)
      .expect(200, function () {
        console.log("Uploaded Anonymous:", file);
        callback();
      });
    ;
  }, function (error) {
    if (error) throw error;
    done();
  });
}

function userLoader (files, done) {
  async.eachSeries(files, function (file, callback) {
    var username = Math.random().toString(36).substring(7);
    async.series([
      function (cb) {
        var request = {
          "username": username,
          "email": username + "@test.com",
          "password": "secret"
        };
        agent.post('/users/').send(request).expect(201, function () {
          console.log("Created User:", username);
          cb(null);
        });
      },
      function (cb) {
        var request = {
          "username": username,
          "email": username + "@test.com",
          "password": "secret"
        };
        agent.post('/users/login/').send(request).expect(200, function () {
          console.log("Logged into User:", username);
          cb(null);
        });
      },
      function (cb) {
        agent
          .post('/submissions/')
          .field('title', 'This is a title')
          .field('caption', 'This is a caption.')
          .field('private', 'false')
          .field('anonymous', 'false')
          .attach('file', file)
          .expect(200, function () {
            console.log("Uploaded User:", username, file);
            cb(null);
          })
        ;
      },
      function (cb) {
        var request = {
          "username": username,
          "email": username + "@test.com",
          "password": "secret"
        };
        agent.post('/users/logout/').send(request).expect(200, function () {
          console.log("Logged out of User:", username);
          cb(null);
        });
      },
    ], function (error) {
      if (error) throw error;
      callback();
    });
  }, function (error) {
      if (error) throw error;
      done();
  });
}

async.series([
  function (cb) {
    console.log("Create Sample Database =====================================");
    before(function () {
      cb(null);
    });
  },
  function (cb) {
    console.log("Start Anonymous Uploads ====================================");
    anonymousLoader(anonImages, function () {
      console.log("Finish Anonymous Uploads ====================================");
      cb(null);
    });
  },
  function (cb) {
    console.log("Start User Uploads ==========================================");
    userLoader(userImages, function () {
      console.log("Finish User Uploads =========================================");
      cb(null);
    });
  },
], function (error) {
  if (error) throw error;
  console.log("Sample Database Has Been Populated ==========================");
  process.exit(0);
});