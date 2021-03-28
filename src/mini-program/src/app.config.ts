export default {
  pages: ['pages/index/index', 'pages/me/index', 'pages/recruitDetail/index'],
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
};
