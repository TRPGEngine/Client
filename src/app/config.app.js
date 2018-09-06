const config = require('../../config/project.config');

module.exports = {
  defaultImg: {
    user: null, // 让系统系统生成
    group: require('../assets/img/gugugu1.png'),
    trpgsystem: require('../assets/img/system_notice.png'),
    actor: null,
  },
  oauth: {
    qq: {
      icon: require('../assets/img/oauth/qqconnect.png'),
    }
  }
}
