// name from http://chir.ag/projects/name-that-color/
// antd color from https://github.com/ant-design/ant-design-colors

import * as antdColor from '@ant-design/colors';

declare module 'styled-components' {
  interface DefaultTheme {
    border: ThemeType['border'];
    radius: ThemeType['radius'];
    color: ThemeType['color'];
    boxShadow: ThemeType['boxShadow'];
    filter: ThemeType['filter'];
    mixins: ThemeType['mixins'];
  }
}

type ThemeType = typeof styledTheme;
const styledTheme = {
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
    tacao: '#EDAB7C',
    'pine-cone': '#726155',
    tan: '#D0A282',
    downy: '#65CAB0',
    gold: '#FFD700',
    'alizarin-crimson': '#EC2121',
  },
  boxShadow: {
    normal: 'rgba(0, 0, 0, 0.15) 0 0 8px',
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
  },
};

export default styledTheme;
