import React from 'react';
import { Router, Switch, Route, RouteProps } from 'react-router';
import Login from '@portal/sso/Login';
import ActorList from '@portal/actor/list';
import ActorSelectTemplate from './actor/select-template';
import ActorCreate from '@portal/actor/create';
import ActorEditor from '@portal/actor/editor';
import '@portal/utils/event';
import history from './history';
import ActorDetail from './actor/detail';
import ActorEdit from './actor/edit';
import GroupActorList from './group/actor/list';

interface TitleRouteProps extends RouteProps {
  title: string;
}
const TitleRoute = (route: TitleRouteProps) => {
  return (
    <Route
      path={route.path}
      render={(props) => {
        document.title = route.title || 'TRPG Portal';

        const Component = route.component;

        return <Component {...props}>{route.children}</Component>;
      }}
    />
  );
};

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <TitleRoute title="登录" path="/sso/login" component={Login} />
          <TitleRoute
            title="人物列表"
            path="/actor/list"
            component={ActorList}
          />
          <TitleRoute
            title="选择模板"
            path="/actor/create/select-template"
            component={ActorSelectTemplate}
          />
          <TitleRoute
            title="人物详情"
            path="/actor/detail/:actorUUID"
            component={ActorDetail}
          />
          <TitleRoute
            title="人物编辑"
            path="/actor/edit/:actorUUID"
            component={ActorEdit}
          />
          <TitleRoute
            title="创建人物"
            path="/actor/create/template/:templateUUID"
            component={ActorCreate}
          />
          <TitleRoute
            title="人物编辑器"
            path="/actor/editor"
            component={ActorEditor}
          />
          <TitleRoute
            title="团人物列表"
            path="/group/:groupUUID/actor/list"
            component={GroupActorList}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
