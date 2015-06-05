var supertest = require('supertest');

describe('SlippyNode Image Server REST API Tests', function () {

  var server, agent;

  before(function (done) {
    require('../lib/server')(function (server) {
      server = server;
      agent = supertest.agent(server);
      done();
    });
  });

  describe('USER Tests', function () {

    it('POST register a new user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/users/').send(request).expect(201, done);
    });

    it('POST login to an existing user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/users/login/').send(request).expect(200, done);
    });

    it('POST logout of an existing user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/users/logout/').send(request).expect(200, done);
    });

    it('POST login to an existing user account', function (done) {
      var request = {
        "username": "testuser",
        "email": "testuser@test.com",
        "password": "secret"
      };
      agent.post('/users/login/').send(request).expect(200, done);
    });

    it('PUT changes to a user account', function (done) {
      var request = {
        "username": "testuser2",
        "email": "testuser2@test.com",
        "password": "opensesame"
      };
      agent.put('/users/testuser/').send(request).expect(200, done);
    });

    it('DELETE a user account', function (done) {
      var request = {
        "username": "testuser2",
        "email": "testuser@test.com",
        "password": "opensesame"
      };
      agent.delete('/users/testuser2/').send(request).expect(200, done);
    });

  });

});