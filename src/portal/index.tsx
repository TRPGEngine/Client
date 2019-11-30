import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import '@web/assets/css/iconfont.css';
import './index.css';

import styledTheme from '@src/shared/utils/theme';

ReactDOM.render(
  <ThemeProvider theme={styledTheme}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </ThemeProvider>,
  document.querySelector('#app')
);
