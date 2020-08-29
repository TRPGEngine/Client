import React from 'react';
import { Route, Switch, HashRouter, BrowserRouter } from 'react-router-dom';
import config from '@shared/project.config';
import { TMemo } from '@shared/components/TMemo';
import ErrorBoundary from '@web/containers/ErrorBoundary';
import { AppBanner } from '@web/components/AppBanner';
import { GlobalUI } from '@web/containers/GlobalUI';
import NetworkIndicator from '@web/components/NetworkIndicator';
import { LaunchRoute } from './Launch';
import Login from '@web/containers/Login';
import Register from '@web/containers/Register';
import { MainRoute } from './Main';
import { GlobalStyle } from './style';
import { t } from '@shared/i18n';
import { LoginCheck } from './LoginCheck';
import { PortalProvider } from '@web/components/portal/PortalProvider';
import { PortalHost } from '@web/utils/portal';
import { NetworkStatusModal } from '@web/components/NetworkStatusModal';
import { DarkMode } from './DarkMode';

// 新版Web页面

const Router: any =
  config.platform === 'web' || config.environment === 'development'
    ? BrowserRouter
    : HashRouter;

const CustomProvider: React.FC = (props) => {
  return (
    <PortalProvider>
      <PortalHost>{props.children}</PortalHost>
    </PortalProvider>
  );
};

export const App = TMemo(() => {
  return (
    <Router>
      <ErrorBoundary>
        <DarkMode />
        <GlobalStyle />
        <GlobalUI />
        <div className="app new-ui">
          <CustomProvider>
            <Switch>
              <Route name="login" path="/login" component={Login} />
              <Route name="register" path="/register" component={Register} />
              <Route name="main" path="/main" component={MainRoute} />
              <Route name="index" path="/" component={LaunchRoute} />
            </Switch>
            {config.platform === 'web' && <NetworkStatusModal />}
            <div className="version">
              {t('当前版本号')} v{config.version}
            </div>
            <AppBanner />
            <LoginCheck />
          </CustomProvider>
        </div>
      </ErrorBoundary>
    </Router>
  );
});
App.displayName = 'App';
