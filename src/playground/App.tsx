import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router';
import { createBrowserHistory } from 'history';
import ActorTemplatePreviewer from './preview';
import { ActorLayoutEditor } from './editor/layout-editor';
import { ActorAdvancedEditor } from './editor/advanced-editor';

const history = createBrowserHistory({
  basename: '/playground',
});

const App: React.FC = React.memo((props) => {
  return (
    <Router history={history}>
      <Switch>
        <Route
          exact={true}
          path="/preview"
          component={ActorTemplatePreviewer}
        />
        <Route exact={true} path="/layout/edit" component={ActorLayoutEditor} />
        <Route
          exact={true}
          path="/layout/advanced"
          component={ActorAdvancedEditor}
        />
        <Redirect to="/layout/edit" />
      </Switch>
    </Router>
  );
});

export default App;
