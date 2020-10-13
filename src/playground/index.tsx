import React from 'react';
import ReactDom from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { getStyledTheme } from '@shared/utils/theme';
import App from './App';

import '@web/assets/css/iconfont.css';
import './index.less';

ReactDom.render(
  <ThemeProvider theme={getStyledTheme('light')}>
    <App />
  </ThemeProvider>,
  document.querySelector('#app')
);
