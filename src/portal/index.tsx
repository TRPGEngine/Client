import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from 'styled-components';

import styledTheme from '@src/shared/utils/theme';

ReactDOM.render(
  <ThemeProvider theme={styledTheme}>
    <App />
  </ThemeProvider>,
  document.querySelector('#app')
);
