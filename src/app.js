const express = require('express')
const app = express()
const myFunctions = require('./functions.js')

app.listen(3000, () => console.log('Example app listening on port 3000!'))


// Use it with "localhost:3000/calcul?premier=6&nbr1=5&nbr2=15" for example

app.get('/calcul', function(req, res) {
   // var premier = req.param('premier');
  const nbr1 = parseInt(req.query.nbr1);
  const nbr2 = parseInt(req.query.nbr2);  
  const input_test_premier = parseInt(req.query.premier);

  const pgcd = myFunctions.pgcd(nbr1, nbr2);

  res.write(JSON.stringify(myFunctions.prem(input_test_premier)));
	res.write(JSON.stringify('Le pgcd de '+ nbr1 +' et '+ nbr2 +' est '+ pgcd));
	res.end()
});


var cache = {};

app.post('/set', function(req, res) {
  var query = req.query;
  Object.keys(query).forEach(function(key) {
    cache[key] = query[key];
  });
  res.status(200).end();
});

app.get('/get', function(req, res) {
  res.send(cache[req.query.key]);
});


module.exports = app
