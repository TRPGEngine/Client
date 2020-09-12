// name from http://chir.ag/projects/name-that-color/
// antd color from https://github.com/ant-design/ant-design-colors

// NOTICE: 该文件是共用的，请不要在该文件中引入styled-component

import * as antdColor from '@ant-design/colors';

declare module 'styled-components' {
  interface DefaultTheme {
    style: ThemeType['style'];
    border: ThemeType['border'];
    radius: ThemeType['radius'];
    font: ThemeType['font'];
    color: ThemeType['color'];
    boxShadow: ThemeType['boxShadow'];
    filter: ThemeType['filter'];
    mixins: ThemeType['mixins'];
  }
}

// 中性色 来自antd: https://ant.design/docs/spec/colors-cn
const graySet = [
  '#ffffff', // 0
  '#fafafa', // 1
  '#f5f5f5', // 2
  '#f0f0f0', // 3
  '#d9d9d9', // 4
  '#bfbfbf', // 5
  '#8c8c8c', // 6
  '#595959', // 7
  '#434343', // 8
  '#262626', // 9
  '#1f1f1f', // 10
  '#141414', // 11
  '#000000', // 12
];

type ThemeType = ReturnType<typeof getStyledTheme>;
export type ThemeMode = 'light' | 'dark';

export function getStyledTheme(mode: ThemeMode) {
  const modeValue = (val: [string | number, string | number]): string => {
    if (mode === 'light') {
      return String(val[0]);
    } else if (mode === 'dark') {
      return String(val[1]);
    } else {
      // 没有匹配到任何主题则默认light
      return String(val[0]);
    }
  };

  const color = {
    antd: antdColor,
    graySet,
    borderBase: '#dddddd',
    gallery: '#EFEFEF',
    alabaster: '#FCFCFC',
    'athens-gray': '#F5F7F9',
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
    'sunset-orange': '#FF4D4F',
    periwinkle: '#BEC9FF',
    transparent90: 'rgba(0,0,0,0.1)',
    transparent80: 'rgba(0,0,0,0.2)',
    transparent70: 'rgba(0,0,0,0.3)',
    transparent60: 'rgba(0,0,0,0.4)',
    transparent50: 'rgba(0,0,0,0.5)',

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
    channelsDefault: '#8e9297',
  };

  const theme = {
    style: {
      mode,

      // 这里主要是放一些样式方面的主题设置
      // 方便统一管理
      navbarWidth: '72px',
      navbarBackgroundColor: graySet[9],
      sidebarWidth: '240px',
      sidebarBackgroundColor: graySet[8],
      contentBackgroundColor: graySet[7],
      sectionHeight: '48px',
      modelPanel: {
        bodyBackground: modeValue([color['whisper'], graySet[6]]),
        baseBackground: modeValue(['white', graySet[7]]),
        borderColor: modeValue([color['bon-jour'], color['dove-gray']]),
      },
    },
    border: {
      thin: `.5px solid rgba(232, 232, 232, ${modeValue([0.8, 0.2])})`,
      standard: `1px solid rgba(232, 232, 232, ${modeValue([0.8, 0.2])})`,
    },
    radius: {
      standard: '3px',
      card: '10px',
    },
    font: {
      normal: 'PingFang SC, "Microsoft YaHei", arial, serif',
    },
    color,
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
      oneline: `
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `,
      transition: (property: string, duration: number) =>
        `transition: ${property} ${duration}s ease-in-out;`,
      /**
       * mobile apply css media query
       * NOTE: rn端不可用
       * @usage
       * ${(props) => props.theme.mixins.mobile('margin-right: 0;')}
       */
      mobile: (css: string) => `@media (max-width: 768px) { ${css} }`,
      /**
       * desktop apply css media query
       * NOTE: rn端不可用
       * @usage
       * ${(props) => props.theme.mixins.desktop('margin-right: 0;')}
       */
      desktop: (css: string) => `@media (min-width: 768px) { ${css} }`,
      blockBtn: `
        font-size: 16px;
        border: 0;
        cursor: pointer;
        color: white;
        border-radius: 3px;
        background-color: #999;
        padding: 6px 12px;
        outline: 0;
        user-select: none;

        &:hover, &:active, &.active {
          background-color: #705949;
        }

        &:disabled {
          cursor: not-allowed;
          background-color: #999999;
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

  return theme;
}

const defaultStyledTheme = getStyledTheme('light'); // 这个是为了兼容原来的写法, 有机会应当移除掉
export default defaultStyledTheme;
