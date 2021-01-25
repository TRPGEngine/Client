import React from 'react';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import ActorEditor from './actor-editor';
import ActorTemplatePreviewer from './preview';
import { ActorLayoutEditor } from './editor/layout-editor';

const history = createBrowserHistory({
  basename: '/playground',
});

const App: React.FC = React.memo((props) => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact={true} path="/" component={ActorEditor} />
        <Route
          exact={true}
          path="/preview"
          component={ActorTemplatePreviewer}
        />
        <Route exact={true} path="/layout/edit" component={ActorLayoutEditor} />
      </Switch>
    </Router>
  );
});

export default App;
