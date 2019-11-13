import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Login from '@portal/sso/Login';
import ActorList from '@portal/actor/list';
import ActorEditor from '@portal/actor/editor';
import '@portal/utils/event';
import history from './history';

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route name="login" path="/sso/login" component={Login} />
          <Route name="actor-list" path="/actor/list" component={ActorList} />
          <Route
            name="actor-editor"
            path="/actor/editor"
            component={ActorEditor}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
