var chai = require('chai');
var assert = require('assert')
var expect = chai.expect;

var myFunctions = require('../../src/functions');

describe('myFunctions', function(){
  it ('simple pgcd test', function(){
  	console.log(myFunctions.pgcd(25, 20))
    assert.equal(myFunctions.pgcd(25, 20), 5);
  });
})