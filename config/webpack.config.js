console.log('打包环境:\n', '环境:', process.env.NODE_ENV, '\n', '平台:', process.env.PLATFORM);

module.exports = process.env.NODE_ENV === 'production' ? require('./webpack.prod.config.js') : require('./webpack.dev.config.js')
