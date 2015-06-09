import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import {
  sendMail
}
from './mailService';

var app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.post('/mail', (request, response) => {
  sendMail(request.body)
    .then(result => {
      console.log(result);
      response.send(result);
    })
    .catch(error => {
      console.log(error);
      response.status(500).send(error);
    });
});

var port = process.env.PORT || 3500;

app.listen(port, function() {
  console.log('Listening at port ' + port);
});
