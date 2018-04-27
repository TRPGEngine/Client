import React from 'react';
import { connect } from 'react-redux';
const { Route, Switch, HashRouter, BrowserRouter, Link } = require('react-router-dom');
const Modal = require('../components/Modal');
const Loading = require('../components/Loading');
const Alert = require('../components/Alert');
const NetworkIndicator = require('../components/NetworkIndicator');
const config = require('../../../config/project.config.js');
require('./App.scss');
require('../../assets/css/iconfont.css');
require('react-select/dist/react-select.css');

const Router = (config.platform === 'web' || config.environment === 'development') ? BrowserRouter : HashRouter;
const appVersion = config.version;
const Login = require('./Login');
const Register = require('./Register');
const Main = require('./Main');
const {emojify, getCodeList} = require('../../utils/emoji');

class App extends React.Component {
  render() {
    const {showLoading, showLoadingText} = this.props;
    return (
      <Router>
        <div>
          <Modal />
          <Loading show={showLoading} text={showLoadingText} />
          <Alert />
          <div className="app">
            <Switch>
              <Route name="login" path="/login" component={Login} />
              <Route name="register" path="/register" component={Register} />
              <Route name="main" path="/main" component={Main} />
              <Route name="emoji" path="/emoji">
                <div>
                  {
                    getCodeList().people.map(item => (
                      <span key={item}>{emojify(item)}</span>
                    ))
                  }
                  {
                    getCodeList().nature.map(item => (
                      <span key={item}>{emojify(item)}</span>
                    ))
                  }
                  {
                    getCodeList().objects.map(item => (
                      <span key={item}>{emojify(item)}</span>
                    ))
                  }
                  {
                    getCodeList().places.map(item => (
                      <span key={item}>{emojify(item)}</span>
                    ))
                  }
                  {
                    getCodeList().symbols.map(item => (
                      <span key={item}>{emojify(item)}</span>
                    ))
                  }
                </div>
              </Route>
              <Route name="index" path="/">
                <Link to="login" className="start-btn">
                  <div className="main">点击屏幕登录</div>
                  <div className="sub">Press screen to login</div>
                </Link>
              </Route>
            </Switch>
            {
              config.platform === 'web' ? (
                <NetworkIndicator />
              ) : null
            }
            <div className="version">当前版本号v{appVersion}</div>
          </div>
        </div>
      </Router>
    )
  }
}

module.exports = connect(
  state => ({
    playSound: state.getIn(['pc', 'playSound']),
    showLoading: state.getIn(['ui', 'showLoading']),
    showLoadingText: state.getIn(['ui', 'showLoadingText']),
  })
)(App);
