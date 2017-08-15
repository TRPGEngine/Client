import React from 'react';
import { connect } from 'react-redux';
const { Route, Redirect, IndexRoute, BrowserRouter, Link } = require('react-router-dom');
const Router = BrowserRouter;
// require('./App.scss');
require('./App.scss');

const appConfig = require('../../package.json');
const appVersion = appConfig.version;
const Login = require('./Login');
const User = ({ match }) => {
  return <h1>Hello {match.params.username}!</h1>
}

class App extends React.Component {
  render() {
    // console.log(this.props.state.getIn(['ui', 'showAlert']));
    // console.log(this.props.state.get('ui'));
    return (
      <Router>
        <div className="app">
          <Link to="/login">登录</Link>
          <Link to="/user/user">用户</Link>
          <Route name="login" path="/login" component={Login} />
          <Route name="user" path="/user/:username" component={User} />
          <div className='version'>当前版本号v{appVersion}</div>
        </div>
      </Router>
    )
  }
}

module.exports = connect(
  state => ({
    state: state,
    playSound: state.getIn(['pc', 'playSound']),
  })
)(App);
