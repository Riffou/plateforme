var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/bin/www');
var should = chai.should();
var expect = chai.expect;
var request = require('supertest');
var utilisateursModel = require('../src/models/utilisateurs');

var Cookies;

chai.use(chaiHttp);

describe('Connection', function() {
    it('Home page should respond with 200 status', function(done) {
        chai.request('http://localhost:3000')
            .get('/')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
    it('Challenge page should respond with 200 status', function(done) {
        chai.request('http://localhost:3000')
            .get('/challenges/17')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
    it('redirect to /', function(done){
        request('http://localhost:3000')
            .get('/challenges/17')
            .expect('Location', '/connexion', done);
    });
});


describe('Functional Test', function () {
    it('should create user session for valid user', function (done) {
        request('http://localhost:3000')
            .post('/connexion')
            .send({"identifiantInput": "nicolas", "passwordInput": "password"})
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                Cookies = res.headers['set-cookie'].pop().split(';')[0];
                done();
            });
    });
    it('should get user session for current user', function (done) {
        var req = request('http://localhost:3000')
            .get('/');
        // Set cookie to get saved user session
        req.cookies = Cookies;
        req.set('Accept','application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
           //     console.log(res.text);
                done();
        });
    });
    it('should set injection SQL as read', function (done) {
        var req = request('http://localhost:3000')
            .post('/unites/2/5');
        req.cookies = Cookies;
        req.send()
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                // Check if lesson is read
                utilisateursModel.isLessonValidated(10, 'nicolas', function(isRead, error) {
                   if (error == null) {
                       if (isRead) {
                           done();
                       }
                       // si mag
                   }
                });
            });
    });

});
