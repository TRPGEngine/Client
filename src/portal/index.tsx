import './init';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { WebErrorBoundary } from '@web/components/WebErrorBoundary';
import { AlertErrorView } from '@web/components/AlertErrorView';
import { ThemeContextProvider } from '@shared/context/ThemeContext';
import { PortalReduxProvider } from './components/PortalReduxProvider';

import '@web/assets/css/iconfont.css';
import './index.css';

ReactDOM.render(
  <WebErrorBoundary renderError={AlertErrorView}>
    <PortalReduxProvider>
      <ThemeContextProvider>
        <ConfigProvider locale={zhCN}>
          <App />
        </ConfigProvider>
      </ThemeContextProvider>
    </PortalReduxProvider>
  </WebErrorBoundary>,
  document.querySelector('#app')
);
