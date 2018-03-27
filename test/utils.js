'use strict';

var shell = require('shelljs');

const GETH = require('which').sync('ghuc');

exports.canAttach = function(dataDir) {
  let ret = shell.exec(
    `${GETH} --exec 'huc.coinbase' attach ipc://${dataDir}/ghuc.ipc`, {
      silent: true,
      async: false,
    });

  return ret.code === 0;
};

exports.ghucExecJs = function(dataDir, jsToExecute) {
  let ret = shell.exec(
    `${GETH} --exec '${jsToExecute}' attach ipc://${dataDir}/ghuc.ipc`, {
      silent: true,
      async: false,
    });

  if (ret.code !== 0) {
    throw new Error('Exec error: ' + ret.stderr);
  }

  return ret.stdout;
};










