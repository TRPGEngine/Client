import _get from 'lodash/get';
import robotImg from '@web/assets/img/robot_dark.svg';
import { MsgStyleType } from './types/chat';

const environment = process.env.NODE_ENV || 'development';
const platform = process.env.PLATFORM || 'web';
let currentHost = '127.0.0.1';
let isSSL = false;

const localHost = _get(window, 'location.host');
if (localHost) {
  currentHost = localHost.split(':')[0];
  isSSL = _get(window, 'location.protocol') === 'https:';
}
if (environment === 'production') {
  currentHost = 'trpgapi.moonrailgun.com';
  if (platform === 'app') {
    isSSL = true;
  }
}

const trpgHost = process.env.TRPG_HOST;
let trpgPort: string;
if (trpgHost) {
  const _tmp = trpgHost.split(':');
  currentHost = _tmp[0];
  trpgPort = _tmp[1];
}

if (trpgPort! === '443') {
  isSSL = true;
}

/**
 * portal 服务的地址
 */
const portalUrl =
  process.env.TRPG_PORTAL || 'https://trpg.moonrailgun.com/portal';

const standardPort = isSSL ? '443' : '80';
let apiPort = environment === 'production' ? standardPort : '23256';
if (trpgPort!) {
  apiPort = trpgPort!;
}

interface ProjectConfig {
  version: string;
  environment: string;
  platform: string;
  isSSL: boolean;
  io: {
    protocol: 'wss' | 'ws';
    host: string;
    port: string;
  };
  chat: {
    maxLength: number;
    isWriting: {
      throttle: number;
      timeout: number;
    };
  };
  file: {
    protocol: 'https' | 'http';
    host: string;
    port: string;
    url?: string;
    getFileImage: (ext: string) => string;
    getAbsolutePath?: (path?: string) => string;
    getRelativePath?: (path: string) => string;
    getUploadsImagePath?: (filename: string, isTemporary: boolean) => string;
  };
  defaultImg: {
    user: string;
    getUser: (name: string) => string;
    group: string;
    getGroup: (name: string) => string;
    trpgsystem: string;
    robot: string;
    actor: string;
    chatimg_fail: string;
    file: {
      default: string;
      pdf: string;
      excel: string;
      ppt: string;
      word: string;
      txt: string;
      pic: string;
    };
    color: string[];
  };
  github: {
    projectUrl: string;
    projectPackageUrl: string;
    projectAppPackageUrl: string;
  };
  url: {
    api?: string;
    homepage: string;
    goddessfantasy: string;
    blog: string;
    portal: string;
    getInviteUrl: (inviteCode: string) => string;
  };
  defaultSettings: DefaultSettings;
}

/**
 * 默认设置
 */
const defaultSettings = {
  user: {
    favoriteDice: [] as { title: string; value: string }[],
    msgStyleType: 'bubble' as MsgStyleType,
    msgStyleCombine: false,
  },
  system: {
    notification: true, // 是否通知
    disableSendWritingState: false, // 不发送输入状态
    showSelfInWritingState: false, // 在输入状态中显示自己
  },
};

export type DefaultSettings = typeof defaultSettings;

const config: ProjectConfig = {
  version: require('../../package.json').version,
  environment,
  platform,
  isSSL,
  io: {
    protocol: isSSL ? 'wss' : 'ws',
    host: currentHost,
    port: apiPort,
  },
  chat: {
    maxLength: 800, // 聊天输入框最大长度, 数据库存1000, 前端预留一点存800
    isWriting: {
      throttle: 800, // 节流时间，即至少多少毫秒才会发出一个正在写的信息
      timeout: 5000, // 超时时间，即多少毫秒后仍未接收到正在写操作则自动视为已经停止写。用于处理用户输入一段文字后长时间不进行操作的情况
    },
  },
  file: {
    protocol: isSSL ? 'https' : 'http',
    host: currentHost,
    port: apiPort,
    getFileImage(ext) {
      if (ext === 'jpg' || ext === 'png' || ext === 'gif') {
        return config.defaultImg.file.pic;
      }
      if (ext === 'doc' || ext === 'docx') {
        return config.defaultImg.file.word;
      }
      if (ext === 'xls' || ext === 'xlsx') {
        return config.defaultImg.file.excel;
      }
      if (ext === 'ppt' || ext === 'pptx') {
        return config.defaultImg.file.ppt;
      }
      if (ext === 'pdf') {
        return config.defaultImg.file.pdf;
      }
      if (ext === 'txt') {
        return config.defaultImg.file.txt;
      }

      return config.defaultImg.file.default;
    },
  },
  defaultImg: {
    user: '/src/assets/img/gugugu1.png',
    getUser(name) {
      if (name) {
        return `${config.file.url}/file/avatar/svg?name=${name}`;
      } else {
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 一像素透明图片
      }
    },
    group: '/src/web/assets/img/gugugu1.png',
    getGroup(name) {
      // 同getUser
      if (name) {
        return `${config.file.url}/file/avatar/svg?name=${name}`;
      } else {
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 一像素透明图片
      }
    },
    trpgsystem: '/src/web/assets/img/system_notice.png',
    robot: robotImg,
    actor: '',
    chatimg_fail: '/src/web/assets/img/img_fail.png',
    file: {
      default: '/src/web/assets/img/file/default.png',
      pdf: '/src/web/assets/img/file/pdf.png',
      excel: '/src/web/assets/img/file/excel.png',
      ppt: '/src/web/assets/img/file/ppt.png',
      word: '/src/web/assets/img/file/word.png',
      txt: '/src/web/assets/img/file/txt.png',
      pic: '/src/web/assets/img/file/pic.png',
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
    projectAppPackageUrl:
      'https://raw.githubusercontent.com/TRPGEngine/Client/master/src/app/package.json',
  },
  url: {
    homepage: 'https://trpgdoc.moonrailgun.com/',
    goddessfantasy: 'http://www.goddessfantasy.net/',
    blog: 'https://trpgdoc.moonrailgun.com/blog/',
    portal: portalUrl,
    getInviteUrl(inviteCode: string) {
      return `${portalUrl}/group/invite/${inviteCode}`;
    },
  },
  defaultSettings,
};
config.file.url = `${config.file.protocol}://${config.file.host}:${config.file.port}`;
config.url.api = config.file.url;

// 获取基于API的绝对路径
config.file.getAbsolutePath = function getAbsolutePath(path?: string) {
  if (!path) {
    path = ''; // 设置默认值
  }
  if (path && path[0] === '/') {
    return config.file.url + path;
  }
  return path;
};

// 获取基于APi的相对路径
config.file.getRelativePath = function getAbsolutePath(path) {
  if (!path) {
    path = ''; // 设置默认值
  }
  return path.replace(config.file.url!, '');
};

config.file.getUploadsImagePath = function getUploadsImagePath(
  filename,
  isTemporary = false
) {
  let relativePath = '';
  if (isTemporary) {
    relativePath = `/uploads/temporary/${filename}`;
  } else {
    relativePath = `/uploads/persistence/${filename}`;
  }

  return config.file.url + relativePath;
};

export default config;
