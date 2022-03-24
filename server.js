const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const router = require('./router.js');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use('/api', router);

// handle errors
app.use(function(err, req, res, next) {
  console.log(err);

  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error. Something went wrong :(';

  res.status(err.statusCode).json({status: false, message: err.message});
});

const listenPort = process.env.NODE_LOCAL_PORT || 3000;
const server = app.listen(listenPort, () => {
  console.log('Sword Health Code Challenge listening on port ' + listenPort);
});

module.exports = server;
