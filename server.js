var express = require('express');
var app = express();
var app_port = process.env.VCAP_APP_PORT|| 6080;

app.use(express.static(__dirname));

var server = app.listen( app_port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log(' app listening at http://%s:%s', host, port);
});
