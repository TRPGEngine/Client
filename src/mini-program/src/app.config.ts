import type { Config } from '@tarojs/taro';

const pages = [
  'pages/index/index',
  'pages/me/index',
  'pages/login/index',
  'pages/recruitDetail/index',
];

export default {
  pages,
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: 'TRPG',
        iconPath: 'resource/home.png',
        selectedIconPath: 'resource/home.png',
      },
      {
        pagePath: 'pages/me/index',
        text: '我',
        iconPath: 'resource/me.png',
        selectedIconPath: 'resource/me.png',
      },
    ],
    color: '#000',
    selectedColor: '#56abe4',
    backgroundColor: '#fff',
    borderStyle: 'white',
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
} as Config;
