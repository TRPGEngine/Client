// name from http://chir.ag/projects/name-that-color/

declare module 'styled-components' {
  interface DefaultTheme {
    color: ThemeType['color'];
    boxShadow: ThemeType['boxShadow'];
  }
}

type ThemeType = typeof styledTheme;
const styledTheme = {
  color: {
    borderBase: '#dddddd',
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
};

export default styledTheme;
