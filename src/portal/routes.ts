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
    title: '团人物列表',
    path: '/group/:groupUUID/actor/list',
    component: TLoadable(() => import('@portal/routes/group/actor/list')),
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
    title: '团邀请',
    path: '/group/invite/:inviteCode',
    component: TLoadable(() => import('@portal/routes/group/invite/code')),
  },
  {
    title: '操作成功',
    path: '/result/success',
    component: TLoadable(() => import('@portal/routes/result/success')),
  },
  {
    title: '操作失败',
    path: '/result/error',
    component: TLoadable(() => import('@portal/routes/result/error')),
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
    title: '图片声明',
    path: '/about/image',
    component: TLoadable(() => import('@portal/routes/about/image')),
  },
  {
    title: 'Portal版本信息',
    path: '/about/health',
    component: TLoadable(() => import('@portal/routes/about/health')),
  },
  {
    title: '地图demo',
    path: '/map/:mapUUID/demo',
    component: TLoadable(() => import('@portal/routes/map/demo')),
  },
  {
    title: '团地图',
    path: '/group/:groupUUID/map/:mapUUID/preview',
    component: TLoadable(() => import('@portal/routes/map/preview')),
  },
  {
    title: '团地图(主持人模式)',
    path: '/group/:groupUUID/map/:mapUUID/edit',
    component: TLoadable(() => import('@portal/routes/map/edit')),
  },
  {
    title: '战报列表',
    path: '/trpg/report/list',
    component: TLoadable(() => import('@portal/routes/trpg/report/list')),
  },
  {
    title: '生成战报',
    path: '/trpg/report/create',
    component: TLoadable(() => import('@portal/routes/trpg/report/create')),
  },
  {
    title: '跑团战报',
    path: '/trpg/report/preview/:reportUUID',
    component: TLoadable(() => import('@portal/routes/trpg/report/preview')),
  },
  {
    title: '招募列表',
    path: '/trpg/recruit/list',
    component: TLoadable(() => import('@portal/routes/trpg/recruit/list')),
  },
  {
    title: '招募列表',
    path: '/trpg/recruit/:recruitUUID',
    component: TLoadable(() => import('@portal/routes/trpg/recruit/detail')),
  },
  {
    title: '富文本编辑器demo',
    path: '/demo/editor',
    component: TLoadable(() => import('@portal/routes/demo/editor')),
  },
  {
    title: 'RTC测试',
    path: '/rtc/test',
    component: TLoadable(() => import('@portal/routes/rtc/test')),
  },
];
