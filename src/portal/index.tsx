import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import '@web/assets/css/iconfont.css';
import './index.css';

import styledTheme from '@src/shared/utils/theme';

ReactDOM.render(
  <ErrorBoundary>
    <ThemeProvider theme={styledTheme}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </ThemeProvider>
  </ErrorBoundary>,
  document.querySelector('#app')
);
