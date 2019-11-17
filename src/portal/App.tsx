import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Login from '@portal/sso/Login';
import ActorList from '@portal/actor/list';
import ActorSelectTemplate from './actor/select-template';
import ActorCreate from '@portal/actor/create';
import ActorEditor from '@portal/actor/editor';
import '@portal/utils/event';
import history from './history';
import ActorDetail from './actor/detail';

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route name="login" path="/sso/login" component={Login} />
          <Route name="actor-list" path="/actor/list" component={ActorList} />
          <Route
            name="actor-select-template"
            path="/actor/create/select-template"
            component={ActorSelectTemplate}
          />
          <Route
            name="actor-detail"
            path="/actor/detail/:actorUUID"
            component={ActorDetail}
          />
          <Route
            name="actor-create"
            path="/actor/create/template/:templateUUID"
            component={ActorCreate}
          />
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
