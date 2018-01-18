const config = require('../../../config/project.config');

module.exports = Object.assign(
  {
    RESET: 'RESET',
  },
  require('./actor'),
  require('./cache'),
  require('./chat'),
  require('./group'),
  require('./note'),
  require('./ui'),
  require('./user'),
  config.platform==='app' ? require('./nav') : null,
);
