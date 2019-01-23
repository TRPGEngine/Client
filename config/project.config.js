let environment = process.env.NODE_ENV || 'development';
let platform = process.env.PLATFORM || 'web';
let currentHost = '127.0.0.1';
let isSSL = false;
if (!!window && window.location && window.location.host) {
  currentHost = window.location.host.split(':')[0];
  isSSL = window.location.protocol === 'https:';
}
if (environment == 'production') {
  currentHost = 'trpgapi.moonrailgun.com';
}

let trpgHost = process.env.TRPG_HOST;
if (trpgHost) {
  currentHost = trpgHost;
}

let standardPort = isSSL ? '443' : '80';

let out = {
  version: require('../package.json').version,
  environment,
  platform,
  io: {
    protocol: isSSL ? 'wss' : 'ws',
    host: currentHost,
    port: environment === 'production' ? standardPort : '23256',
  },
  file: {
    protocol: isSSL ? 'https' : 'http',
    host: currentHost,
    port: environment === 'production' ? standardPort : '23256',
    getFileImage: function(ext) {
      if (ext === 'jpg' || ext === 'png' || ext === 'gif') {
        return out.defaultImg.file.pic;
      }
      if (ext === 'doc' || ext === 'docx') {
        return out.defaultImg.file.word;
      }
      if (ext === 'xls' || ext === 'xlsx') {
        return out.defaultImg.file.excel;
      }
      if (ext === 'ppt' || ext === 'pptx') {
        return out.defaultImg.file.ppt;
      }
      if (ext === 'pdf') {
        return out.defaultImg.file.pdf;
      }
      if (ext === 'txt') {
        return out.defaultImg.file.txt;
      }

      return out.defaultImg.file.default;
    },
  },
  defaultImg: {
    user: '/src/assets/img/gugugu1.png',
    getUser(name) {
      if (name) {
        return `${out.file.url}/file/avatar/svg?name=${name}`;
      } else {
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 一像素透明图片
      }
    },
    group: '/src/assets/img/gugugu1.png',
    trpgsystem: '/src/assets/img/system_notice.png',
    actor: '',
    chatimg_fail: '/src/assets/img/img_fail.png',
    file: {
      default: '/src/assets/img/file/default.png',
      pdf: '/src/assets/img/file/pdf.png',
      excel: '/src/assets/img/file/excel.png',
      ppt: '/src/assets/img/file/ppt.png',
      word: '/src/assets/img/file/word.png',
      txt: '/src/assets/img/file/txt.png',
      pic: '/src/assets/img/file/pic.png',
    },
    color: [
      '#333333',
      '#2c3e50',
      '#8e44ad',
      '#2980b9',
      '#27ae60',
      '#16a085',
      '#f39c12',
      '#d35400',
      '#c0392b',
      '#3498db',
      '#9b59b6',
      '#2ecc71',
      '#1abc9c',
      '#f1c40f',
      '#e74c3c',
      '#e67e22',
    ],
  },
  github: {
    projectUrl: 'https://github.com/TRPGEngine/Client',
    projectPackageUrl:
      'https://raw.githubusercontent.com/TRPGEngine/Client/master/package.json',
  },
  url: {
    goddessfantasy: 'http://www.goddessfantasy.net/',
    blog: 'http://moonrailgun.com',
  },
  defaultSettings: {
    user: {
      favoriteDice: [],
    },
    system: {
      notification: true,
    },
  },
};
out.file.url = `${out.file.protocol}://${out.file.host}:${out.file.port}`;

// 获取基于API的绝对路径
out.file.getAbsolutePath = function getAbsolutePath(path) {
  if (!path) {
    path = ''; // 设置默认值
  }
  if (path && path[0] === '/') {
    return out.file.url + path;
  }
  return path;
};

// 获取基于APi的相对路径
out.file.getRelativePath = function getAbsolutePath(path) {
  if (!path) {
    path = ''; // 设置默认值
  }
  return path.replace(out.file.url, '');
};

module.exports = out;
