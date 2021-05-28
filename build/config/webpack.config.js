console.log(
  '打包环境:\n',
  '环境:',
  process.env.NODE_ENV,
  '\n',
  '平台:',
  process.env.PLATFORM
);

if (process.env.CI === 'true') {
  module.exports = require('./webpack.ci.config.js');
} else if (process.env.NODE_ENV === 'production') {
  module.exports = require('./webpack.prod.config.js');
} else {
  module.exports = require('./webpack.dev.config.js');
}
