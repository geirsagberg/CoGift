/// <reference path="typings/tsd.d.ts" />
var express = require('express');
var app = express();
app.use(express.static(__dirname + "/public"));
var port = 3500;
var server = app.listen(port, function () {
    console.log("Listening at http://localhost:" + port);
});
