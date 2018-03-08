/*var chai = require('chai');
var chaiHttp = require('chai-http');
//var app = require('../app');

var expect = chai.expect;

chai.use(chaiHttp);


describe('App', function() {
  describe('/set?premier=11', function() {
    it('responds with status 200', function(done) {
      chai.request('http://localhost:3000')
        .post('/set?premier=11')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

describe('/calcul', function() {
    it('responds with status 200', function(done) {
      chai.request('http://localhost:3000')
        .post('/set?premier=78&nbr1=75&nbr2=43')
        .then(function() {
          chai.request('http://localhost:3000')
            .get('/calcul?premier=78&nbr1=75&nbr2=43')
            .end(function(err, res) {
              expect(res).to.have.status(200);
              expect(res.text).to.equal('"78 est premier : false""Le pgcd de 75 et 43 est 1"');
              done();
            });
        });
    });
  });

*/