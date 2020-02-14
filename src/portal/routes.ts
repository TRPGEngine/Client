import TLoadable from '@web/components/TLoadable';
import { ComponentType } from 'react';

interface RouteConfig {
  title: string;
  path: string;
  component: ComponentType<any>;
}

export const routes: RouteConfig[] = [
  {
    title: '登录',
    path: '/sso/login',
    component: TLoadable(() => import('@portal/routes/sso/Login')),
  },
  {
    title: '人物列表',
    path: '/actor/list',
    component: TLoadable(() => import('@portal/routes/actor/list')),
  },
  {
    title: '选择模板',
    path: '/actor/create/select-template',
    component: TLoadable(() => import('@portal/routes/actor/select-template')),
  },
  {
    title: '人物详情',
    path: '/actor/detail/:actorUUID',
    component: TLoadable(() => import('@portal/routes/actor/detail')),
  },
  {
    title: '人物编辑',
    path: '/actor/edit/:actorUUID',
    component: TLoadable(() => import('@portal/routes/actor/edit')),
  },
  {
    title: '创建人物',
    path: '/actor/create/template/:templateUUID',
    component: TLoadable(() => import('@portal/routes/actor/create')),
  },
  {
    title: '人物编辑器',
    path: '/actor/editor',
    component: TLoadable(() => import('@portal/routes/actor/editor')),
  },
  {
    title: '团人物列表',
    path: '/group/:groupUUID/actor/list',
    component: TLoadable(() => import('@portal/routes/actor/list')),
  },
  {
    title: '团人物详情',
    path: '/group/:groupUUID/actor/:groupActorUUID/detail',
    component: TLoadable(() => import('@portal/routes/group/actor/detail')),
  },
  {
    title: '团人物编辑',
    path: '/group/:groupUUID/actor/:groupActorUUID/edit',
    component: TLoadable(() => import('@portal/routes/group/actor/edit')),
  },
  {
    title: '创建模板',
    path: '/template/create',
    component: TLoadable(() => import('@portal/routes/template/create')),
  },
  {
    title: '创建笔记',
    path: '/note/create',
    component: TLoadable(() => import('@portal/routes/note/create')),
  },
  {
    title: '下载App',
    path: '/deploy',
    component: TLoadable(() => import('@portal/routes/deploy')),
  },
  {
    title: '帮助反馈',
    path: '/help',
    component: TLoadable(() => import('@portal/routes/help')),
  },
  {
    title: '免责声明',
    path: '/about/disclaimer',
    component: TLoadable(() => import('@portal/routes/about/disclaimer')),
  },
  {
    title: 'Portal版本信息',
    path: '/about/health',
    component: TLoadable(() => import('@portal/routes/about/health')),
  },
  {
    title: '地图demo',
    path: '/map/demo',
    component: TLoadable(() => import('@portal/routes/map/demo')),
  },
];
