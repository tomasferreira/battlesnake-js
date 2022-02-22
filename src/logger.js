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
  // eslint-disable-next-line no-undef
  const path = `${__dirname}/../logs/${gameId}.txt`;
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
  log += `ERROR: ${message}\n`;
  if (p.CONSOLE_LOG) console.error(`ERROR: ${message}`);
  exLog += `EX ON TURN ${turn != null ? turn : 'none'}: ${message}\n`;
  exceptions++;
};
const status = message => {
  log += `${message}\n`;
  if (p.CONSOLE_LOG && p.STATUS) console.log(`${message}`);
};
const debug = message => {
  log += `DEBUG: ${message}\n`;
  if (p.CONSOLE_LOG && p.DEBUG) console.log(`DEBUG: ${message}`);
};

module.exports = {
  initGameLogs: initGameLogs,
  writeLogs: writeLogs,
  error: error,
  status: status,
  debug: debug
};