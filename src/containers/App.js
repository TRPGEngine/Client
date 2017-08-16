import React from 'react';
import { connect } from 'react-redux';
const { Route, Redirect, IndexRoute, BrowserRouter, Link } = require('react-router-dom');
const Router = BrowserRouter;
const Loading = require('../components/Loading');
require('./App.scss');
require('../assets/css/font-awesome.css');

const appConfig = require('../../package.json');
const appVersion = appConfig.version;
const Login = require('./Login');
const User = ({ match }) => {
  return <h1>Hello {match.params.username}!</h1>
}
const Main = require('./Main');

class App extends React.Component {
  render() {
    // console.log(this.props.state.getIn(['ui', 'showAlert']));
    // console.log(this.props.state.get('ui'));
    return (
      <Router>
        <div>
          <Loading show={this.props.showLoading} />
          <div className="app">
            <Route name="login" path="/login" component={Login} />
            <Route name="user" path="/user/:username" component={User} />
            <Route name="main" path="/main(/*)" component={Main} />
            <div className='version'>当前版本号v{appVersion}</div>
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
  })
)(App);
