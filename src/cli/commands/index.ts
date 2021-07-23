const abbrev = require('abbrev');
require('../../lib/spinner').isRequired = false;

// TODO: change imports to introduce types for the CLI commands (currently it breaks too many tests)
const auth = require('./auth');
// const config = require('./config');
const help = require('./help');
const ignore = require('./ignore');
const monitor = require('./monitor');
const fix = require('./fix');
const policy = require('./policy');
const protect = require('./protect');
const testcmd = require('./test');
const version = require('./version');
const wizard = require('./protect/wizard');
const woof = require('./woof');

const commands = {
  auth,
  config: async (...args) => ((await import('./config')) as any)(...args),
  help,
  ignore,
  monitor,
  fix,
  policy,
  protect,
  test: testcmd,
  version,
  wizard,
  woof,
};

(commands as any).aliases = abbrev(Object.keys(commands));
(commands as any).aliases.t = 'test';

export = commands;
