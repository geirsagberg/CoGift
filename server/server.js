import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import {sendMail} from './mailService';

var app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/list/:id', (request, response) => {
  var {id} = request.params;
  
});
app.post('/mail', (request, response) => {
  sendMail(request.body)
    .then(result => {
      console.log(result);
      response.send(result);
    })
    .catch(result => {
      console.log(result);
      response.status(result.status === 'fail' ? 400 : 500).send(result);
    });
});

var port = process.env.PORT || 3500;

app.listen(port, function() {
  console.log('Listening at port ' + port);
});
