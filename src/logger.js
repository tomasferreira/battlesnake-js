const fs = require('fs');
const p = require('./params');

let log = '';
let exLog = '############################# EXCEPTIONS\n';
let exceptions = 0;

const initGameLogs = () => {
  log = '';
  exLog = '############################# EXCEPTIONS\n';
  exceptions = 0;
};

// write logs for game to file and update the index of logs
const writeLogs = (data) => {
  if (p.CONSOLE_LOG) console.log(exLog);
  const gameId = data.game.id;
  let date = new Date();
  let timestamp = date.toISOString();
  // eslint-disable-next-line no-undef
  const path = `${__dirname}/../logs/${timestamp} - ${gameId}.txt`;
  // append game exeptions to end of log for easy viewing
  log += '\n' + exLog;
  // write log
  fs.writeFile(
    path,
    log,
    err => {
      if (err) return console.log(`There was an error saving the logs: ${err}`);
      console.log(`The log for game ${gameId} was saved.`);
    }
  );
  return exceptions;
};

// debug levels
const error = (message, turn = null) => {
  if (p.LOG_TIMESTAMP) message = new Date().toISOString() + ': ' + message;
  log += `ERROR: ${message}\n`;
  if (p.CONSOLE_LOG) console.error(`ERROR: ${message}`);
  exLog += `EX ON TURN ${turn != null ? turn : 'none'}: ${message}\n`;
  exceptions++;
};
const info = message => {
  if (p.LOG_TIMESTAMP) message = new Date().toISOString() + ': ' + message;
  log += `INFO: ${message}\n`;
  if (p.CONSOLE_LOG && p.INFO) console.log(`INFO: ${message}`);
};
const debug = message => {
  if (p.LOG_TIMESTAMP) message = new Date().toISOString() + ': ' + message;
  log += `DEBUG: ${message}\n`;
  if (p.CONSOLE_LOG && p.DEBUG) console.log(`DEBUG: ${message}`);
};

module.exports = {
  initGameLogs,
  writeLogs,
  error,
  info,
  debug
};