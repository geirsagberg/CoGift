var express = require('express');
var path = require('path');

var app = express();
app.use(express.static(__dirname + "/public"));

var port = process.env.PORT || 3500;

var server = app.listen(port, () => {
	console.log("Listening at http://localhost:" + port);
});
