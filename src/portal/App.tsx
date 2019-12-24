import React from 'react';
import { Router, Switch, Route, RouteProps } from 'react-router';

import { postMessage } from '@portal/utils/event';
import history from './history';
import TLoadable from '@web/components/TLoadable';

const Login = TLoadable(() => import('@portal/routes/sso/Login'));
const ActorList = TLoadable(() => import('@portal/routes/actor/list'));
const ActorSelectTemplate = TLoadable(() =>
  import('@portal/routes/actor/select-template')
);
const ActorCreate = TLoadable(() => import('@portal/routes/actor/create'));
const ActorEditor = TLoadable(() => import('@portal/routes/actor/editor'));
const ActorDetail = TLoadable(() => import('@portal/routes/actor/detail'));
const ActorEdit = TLoadable(() => import('@portal/routes/actor/edit'));
const GroupActorList = TLoadable(() =>
  import('@portal/routes/group/actor/list')
);
const GroupActorDetail = TLoadable(() =>
  import('@portal/routes/group/actor/detail')
);
const GroupActorEdit = TLoadable(() =>
  import('@portal/routes/group/actor/edit')
);
const NoteCreate = TLoadable(() => import('@portal/routes/note/create'));
const DeployLatest = TLoadable(() => import('@portal/routes/deploy'));

interface TitleRouteProps extends RouteProps {
  title: string;
}
const TitleRoute: React.FC<TitleRouteProps> = React.memo((route) => {
  const { path, title } = route;

  return (
    <Route
      path={path}
      render={(props) => {
        document.title = title || 'TRPG Portal';

        postMessage('common::updatePath', {
          title: document.title,
          path,
        });

        const Component = route.component;
        return <Component {...props}>{route.children}</Component>;
      }}
    />
  );
});
TitleRoute.displayName = 'TitleRoute';

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
          <TitleRoute
            title="团人物详情"
            path="/group/:groupUUID/actor/:groupActorUUID/detail"
            component={GroupActorDetail}
          />
          <TitleRoute
            title="团人物编辑"
            path="/group/:groupUUID/actor/:groupActorUUID/edit"
            component={GroupActorEdit}
          />
          <TitleRoute
            title="创建笔记"
            path="/note/create"
            component={NoteCreate}
          />
          <TitleRoute title="下载App" path="/deploy" component={DeployLatest} />
        </Switch>
      </Router>
    );
  }
}

export default App;
