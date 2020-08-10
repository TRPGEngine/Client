import React from 'react';
import { Route, Switch, HashRouter, BrowserRouter } from 'react-router-dom';
import config from '@shared/project.config';
import { TMemo } from '@shared/components/TMemo';
import ErrorBoundary from '@web/containers/ErrorBoundary';
import { AppBanner } from '@web/components/AppBanner';
import GlobalUI from '@web/containers/GlobalUI';
import NetworkIndicator from '@web/components/NetworkIndicator';
import { LaunchRoute } from './Launch';
import Login from '@web/containers/Login';
import Register from '@web/containers/Register';
import { MainRoute } from './Main';
import { GlobalStyle } from './style';
import { t } from '@shared/i18n';
import { LoginCheck } from './LoginCheck';
import { PortalProvider } from '@web/components/portal/PortalProvider';

// 新版Web页面

const Router: any =
  config.platform === 'web' || config.environment === 'development'
    ? BrowserRouter
    : HashRouter;

export const App = TMemo(() => {
  return (
    <Router>
      <ErrorBoundary>
        <GlobalStyle />
        <GlobalUI />
        <div className="app">
          <PortalProvider>
            <Switch>
              <Route name="login" path="/login" component={Login} />
              <Route name="register" path="/register" component={Register} />
              <Route name="main" path="/main" component={MainRoute} />
              <Route name="index" path="/" component={LaunchRoute} />
            </Switch>
            {config.platform === 'web' ? <NetworkIndicator /> : null}
            <div className="version">
              {t('当前版本号')} v{config.version}
            </div>
            <AppBanner />
            <LoginCheck />
          </PortalProvider>
        </div>
      </ErrorBoundary>
    </Router>
  );
});
App.displayName = 'App';
