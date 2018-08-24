const config = require('../../config/project.config');

module.exports = {
  defaultImg: {
    user: require('../assets/img/gugugu1.png'),
    getUser (name) {
      return `${config.file.url}/file/avatar/svg?name=${name || ''}`
    },
    group: require('../assets/img/gugugu1.png'),
    trpgsystem: require('../assets/img/system_notice.png'),
    actor: null,
  }
}
