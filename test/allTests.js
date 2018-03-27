var test = module.exports = {};

[
  'basic',
  'logger',
  'cleanup',
  'ghucOptions',
  'ghucPath',
  'customDataDir',
  'genesisOptions',
  'consoleExec',
  'balance',
  'autoMine',
].forEach(function(name) {
  test[name] = require(`./${name}.test`);
});
