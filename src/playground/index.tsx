import React from 'react';
import ReactDom from 'react-dom';
import { ThemeProvider } from 'styled-components';
import styledTheme from '@shared/utils/theme';
import App from './App';

import '@web/assets/css/iconfont.css';
import './index.less';

ReactDom.render(
  <ThemeProvider theme={styledTheme}>
    <App />
  </ThemeProvider>,
  document.querySelector('#app')
);
