var express = require('express');
var fs = require('fs');
var app = express.createServer(express.logger());
var rFile =  fs.readFileSync("index.html");

var output = rFile.toString();

app.get('/', function(request, response) {
  response.send(output);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
