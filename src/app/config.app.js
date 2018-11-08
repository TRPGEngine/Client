const config = require('../../config/project.config');

const out = {
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
  file: {
    getFileImage: function(ext) {
      if(ext === 'jpg' || ext === 'png' || ext === 'gif') {
        return out.defaultImg.file.pic;
      }
      if(ext === 'doc' || ext === 'docx') {
        return out.defaultImg.file.word;
      }
      if(ext === 'xls' || ext === 'xlsx') {
        return out.defaultImg.file.excel;
      }
      if(ext === 'ppt' || ext === 'pptx') {
        return out.defaultImg.file.ppt;
      }
      if(ext === 'pdf') {
        return out.defaultImg.file.pdf;
      }
      if(ext === 'txt') {
        return out.defaultImg.file.txt;
      }

      return out.defaultImg.file.default;
    }
  },
  oauth: {
    qq: {
      icon: require('../assets/img/oauth/qqconnect.png'),
    }
  }
}

module.exports = out;
