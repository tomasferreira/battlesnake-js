const express = require('express');
const logger = require('morgan');
const { info, start, move, end } = require('./main');

const app = express();
app.enable('verbose errors');

app.use(express.json());
app.use(logger('dev'));
// eslint-disable-next-line no-undef
app.use('/logs', express.static(__dirname + '/logs'));
app.use(function (req, res, next) {
  res.set('Server', 'BattlesnakeOfficial/starter-snake-javascript');
  next();
});

// eslint-disable-next-line no-undef
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send(info());
});

app.post('/start', (req, res) => {
  res.send(start(req.body));
});

app.post('/move', (req, res) => {
  res.send(move(req.body));
});

app.post('/end', (req, res) => {
  res.send(end(req.body));
});

// Start the Express server
app.listen(port, () => {
  console.log(`Starting Battlesnake Server at http://0.0.0.0:${port}...`);
});
