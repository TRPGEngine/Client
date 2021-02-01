import _get from 'lodash/get';
import _isString from 'lodash/isString';
import { getDefaultImage } from './assets';
import type { MsgStyleType } from './types/chat';
import url from 'url';

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
} else if (environment === 'development') {
  // 在开发环境下强制后端请求全是http
  isSSL = false;
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
if (_isString(trpgPort!)) {
  apiPort = trpgPort!;
}

const rtc = process.env.RTC_HOST || 'wss://rtc.moonrailgun.com:4443'; // 语音服务器地址

interface ProjectConfig {
  version: string;
  environment: string;
  platform: string;
  isSSL: boolean;
  devSW: boolean;
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
    rtc: string;
    homepage: string;
    docs: string;
    goddessfantasy: string;
    loginUrl: string;
    blog: string;
    versionBlog: string; // 版本发布日志
    portal: string;
    rsshub: string;
    getInviteUrl: (inviteCode: string) => string;
    rssNews: { name: string; url: string }[];
    txcUrl: string; // 兔小巢地址
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
    msgInputHistorySwitch: true, // 聊天输入框上下键快速切换历史消息
  },
  system: {
    notification: true, // 是否通知
    disableSendWritingState: false, // 不发送输入状态
    showSelfInWritingState: false, // 在输入状态中显示自己
    chatBoxType: 'auto' as 'auto' | 'compatible', // 聊天框类型 有auto, compatible
    audioConstraints: {
      noiseSuppression: false, // 噪音抑制
      autoGainControl: false, // 自动增益
      echoCancellation: false, // 回声消除
    },
  },
};

const rsshub = 'https://rss.moonrailgun.com/'; // rsshub 服务的地址
/**
 * 用于portal的新闻功能
 */
const rssNews = [
  {
    name: '贴吧',
    url: url.resolve(
      rsshub,
      '/tieba/forum/跑团?code=42bacec52565b92308da5f98ec1509c9'
    ),
  },
];

export type DefaultSettings = typeof defaultSettings;

const file: ProjectConfig['file'] = {
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
};
file.url = `${file.protocol}://${file.host}:${file.port}`;

// 获取基于API的绝对路径
file.getAbsolutePath = function getAbsolutePath(path?: string) {
  if (!path) {
    path = ''; // 设置默认值
  }
  if (path && path[0] === '/') {
    return file.url + path;
  }
  return path;
};

// 获取基于APi的相对路径
file.getRelativePath = function getAbsolutePath(path) {
  if (!path) {
    path = ''; // 设置默认值
  }
  return path.replace(file.url!, '');
};

file.getUploadsImagePath = function getUploadsImagePath(
  filename,
  isTemporary = false
) {
  let relativePath = '';
  if (isTemporary) {
    relativePath = `/uploads/temporary/${filename}`;
  } else {
    relativePath = `/uploads/persistence/${filename}`;
  }

  return file.url + relativePath;
};

const config: ProjectConfig = {
  version: require('../../package.json').version,
  environment,
  platform,
  isSSL,
  devSW: process.env.DEV_SW === 'true' || false,
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
  file,
  defaultImg: {
    ...getDefaultImage({
      fileUrl: file.url,
    }),
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
    rtc,
    homepage: 'https://trpgdoc.moonrailgun.com/',
    docs: 'https://trpgdoc.moonrailgun.com/',
    goddessfantasy: 'http://www.goddessfantasy.net/',
    loginUrl:
      environment === 'production'
        ? 'https://trpgdoc.moonrailgun.com/features'
        : '', // 登录页面右侧的地址
    blog: 'https://trpgdoc.moonrailgun.com/blog/',
    versionBlog:
      'https://trpgdoc.moonrailgun.com/blog/tags/%E7%89%88%E6%9C%AC%E5%8F%91%E5%B8%83',
    portal: portalUrl,
    rsshub,
    getInviteUrl(inviteCode: string) {
      return `${portalUrl}/group/invite/${inviteCode}`;
    },
    /**
     *
     */
    rssNews,
    txcUrl: 'https://support.qq.com/products/308023',
  },
  defaultSettings,
};

config.url.api = config.file.url;

export default config;
