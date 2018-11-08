const config = require('../../config/project.config');

module.exports = {
  defaultImg: {
    user: null, // 让系统系统生成
    group: require('../assets/img/gugugu1.png'),
    trpgsystem: require('../assets/img/system_notice.png'),
    actor: null,
    file: {
      default: require('../assets/img/file/default.png'),
      pdf: require('../assets/img/file/pdf.png'),
      excel: require('../assets/img/file/excel.png'),
      ppt: require('../assets/img/file/ppt.png'),
      word: require('../assets/img/file/word.png'),
      txt: require('../assets/img/file/txt.png'),
      pic: require('../assets/img/file/pic.png'),
    },
  },
  oauth: {
    qq: {
      icon: require('../assets/img/oauth/qqconnect.png'),
    }
  }
}
