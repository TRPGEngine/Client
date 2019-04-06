import React from 'react';
import { connect } from 'react-redux';
import TLoadable from '../components/TLoadable';
import {
  Route,
  Switch,
  HashRouter,
  BrowserRouter,
  Link,
} from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import NetworkIndicator from '../components/NetworkIndicator';
import config from '../../../config/project.config.js';
import './App.scss';
require('../../assets/css/iconfont.css');
require('react-select/dist/react-select.css');
require('react-image-lightbox/style.css');

const ActorEditor = TLoadable(() => import('./actor/editor/ActorEditor'));

const Router =
  config.platform === 'web' || config.environment === 'development'
    ? BrowserRouter
    : HashRouter;
const appVersion = config.version;
import Login from './Login';
import Register from './Register';
import Main from './Main';
import GlobalUI from './GlobalUI';
import { emojify, getCodeList } from '../../shared/utils/emoji';

class App extends React.Component {
  render() {
    return (
      <Router>
        <ErrorBoundary>
          <GlobalUI />
          <div className="app">
            <Switch>
              <Route name="login" path="/login" component={Login} />
              <Route name="register" path="/register" component={Register} />
              <Route name="main" path="/main" component={Main} />
              <Route name="main" path="/actor-editor" component={ActorEditor} />
              <Route name="emoji" path="/emoji">
                <div>
                  {getCodeList().people.map((item) => (
                    <span key={item}>{emojify(item)}</span>
                  ))}
                  {getCodeList().nature.map((item) => (
                    <span key={item}>{emojify(item)}</span>
                  ))}
                  {getCodeList().objects.map((item) => (
                    <span key={item}>{emojify(item)}</span>
                  ))}
                  {getCodeList().places.map((item) => (
                    <span key={item}>{emojify(item)}</span>
                  ))}
                  {getCodeList().symbols.map((item) => (
                    <span key={item}>{emojify(item)}</span>
                  ))}
                </div>
              </Route>
              <Route name="index" path="/">
                <Link to="login" className="start-btn">
                  <div className="main">点击屏幕登录</div>
                  <div className="sub">Press screen to login</div>
                </Link>
              </Route>
            </Switch>
            {config.platform === 'web' ? <NetworkIndicator /> : null}
            <div className="version">当前版本号v{appVersion}</div>
          </div>
        </ErrorBoundary>
      </Router>
    );
  }
}

export default connect()(App);
