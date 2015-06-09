import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/mail', (req, res) => {
	console.dir(req.body);
	res.sendStatus(200);
});

var port = process.env.PORT || 3500;

app.listen(port, function() {
	console.log('Listening at port ' + port);
});
