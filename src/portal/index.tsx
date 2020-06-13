import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import styledTheme from '@src/shared/utils/theme';
import { WebErrorBoundary } from '@web/components/WebErrorBoundary';
import { PortalErrorView } from './ErrorView';

import '@web/assets/css/iconfont.css';
import './index.css';

ReactDOM.render(
  <WebErrorBoundary renderError={PortalErrorView}>
    <ThemeProvider theme={styledTheme}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </ThemeProvider>
  </WebErrorBoundary>,
  document.querySelector('#app')
);
