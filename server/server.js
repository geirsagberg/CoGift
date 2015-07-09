import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import morgan from 'morgan';
import './firebaseJobs';
import './firebaseAuth';

var app = express();
app.use(compression());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/list/:id', (request, response) => {
  response.sendFile('index.html', {root: './public'});
});

var port = process.env.PORT || 3500;

app.listen(port, function() {
  console.log('Listening at port ' + port);
});
