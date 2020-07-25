// name from http://chir.ag/projects/name-that-color/
// antd color from https://github.com/ant-design/ant-design-colors

// NOTICE: 该文件是共用的，请不要在该文件中引入styled-component

import * as antdColor from '@ant-design/colors';

declare module 'styled-components' {
  interface DefaultTheme {
    style: ThemeType['style'];
    border: ThemeType['border'];
    radius: ThemeType['radius'];
    color: ThemeType['color'];
    boxShadow: ThemeType['boxShadow'];
    filter: ThemeType['filter'];
    mixins: ThemeType['mixins'];
  }
}

// 中性色 来自antd: https://ant.design/docs/spec/colors-cn
const graySet = [
  '#ffffff',
  '#fafafa',
  '#f5f5f5',
  '#f0f0f0',
  '#d9d9d9',
  '#bfbfbf',
  '#8c8c8c',
  '#595959',
  '#434343',
  '#262626',
  '#1f1f1f',
  '#141414',
  '#000000',
];

type ThemeType = typeof styledTheme;
const styledTheme = {
  style: {
    // 这里主要是放一些样式方面的主题设置
    // 方便统一管理
    navbarWidth: '72px',
    navbarBackgroundColor: graySet[9],
    sidebarWidth: '240px',
    sidebarBackgroundColor: graySet[8],
    contentBackgroundColor: graySet[7],
    sectionHeight: '48px',
  },
  border: {
    thin: '.5px solid rgba(232, 232, 232, 0.8)',
    standard: '1px solid rgba(232, 232, 232, 0.8)',
  },
  radius: {
    standard: '3px',
    card: '10px',
  },
  color: {
    antd: antdColor,
    graySet,
    borderBase: '#dddddd',
    gallery: '#EFEFEF',
    alabaster: '#FCFCFC',
    'seashell-peach': '#FFF4EB',
    whisper: '#FAFAFC',
    soapstone: '#FFFBF8',
    'white-linen': '#FBF5F1',
    'wild-sand': '#F5F5F5',
    'pearl-bush': '#F1EBE6',
    saltpan: '#F9FCFA',
    'bon-jour': '#DDDCDD',
    silver: '#CCCCCC',
    'french-gray': '#C7C7CC',
    'silver-sand': '#BDBEBF',
    'dusty-gray': '#999999',
    gray: '#878787',
    'dove-gray': '#666666',
    tundora: '#4a4a4a',
    'mine-shaft': '#333333',
    'cod-gray': '#222222',
    'jungle-mist': '#BACED9',
    'tobacco-brown': '#705949',
    'copper-canyon': '#7E3F12',
    'spicy-mix': '#8C6244',
    'atomic-tangerine': '#FFA160',
    'hit-pink': '#FFA787',
    tacao: '#EDAB7C',
    'pine-cone': '#726155',
    tan: '#D0A282',
    downy: '#65CAB0',
    gold: '#FFD700',
    warning: '#faad14',
    'alizarin-crimson': '#EC2121',
    periwinkle: '#BEC9FF',
    transparent90: 'rgba(0,0,0,0.1)',
    transparent80: 'rgba(0,0,0,0.2)',

    // 功能性分类
    textNormal: '#dcddde',
    textLink: '#00b0f4',
    textMuted: '#72767d',
    interactiveActive: '#fff',
    interactiveHover: '#dcddde',
    interactiveMuted: '#4f545c',
    interactiveNormal: '#b9bbbe',
    headerPrimary: '#fff',
    headerSecondary: '#b9bbbe',
  },
  boxShadow: {
    normal: 'rgba(0, 0, 0, 0.15) 0 0 8px',
    elevationStroke: '0 0 0 1px rgba(4,4,5,0.15)',
    elevationLow:
      '0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05),0 2px 0 rgba(4,4,5,0.05)',
    elevationMedium: '0 4px 4px rgba(0,0,0,0.16)',
    elevationHigh: '0 8px 16px rgba(0,0,0,0.24)',
  },
  filter: {
    grey100: 'grayscale(100%)',
  },
  mixins: {
    autoScrollBar: `
      overflow: hidden;

      &:hover {
        overflow-y: auto;
        overflow-y: overlay;
      }
    `,
    linkBtn: `
      font-size: 14px;
      background-color: transparent;
      border: 0;
      cursor: pointer;
      color: #705949;
      padding: 0 2px;
      margin: 4px 6px;
      outline: 0;
      position: relative;
      user-select: none;

      &:disabled {
        cursor: not-allowed;
        color: #999999;
      }

      &:enabled {
        &:after {
          content: ' ';
          position: absolute;
          border-top: 1px solid #705949;
          bottom: 0;
          transition: all 0.2s ease-in-out;

          left: 0;
          width: 0;
        }

        &:hover,
        &:active,
        &.active {
          &:after {
            border-top: 1px solid #705949;

            width: 100%;
          }
        }
      }
    `,
  },
};

export default styledTheme;
