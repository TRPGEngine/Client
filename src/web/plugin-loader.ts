import { initMiniStar, regDependency, regSharedModule } from 'mini-star';

/**
 * 初始化插件
 */
export function initPlugins() {
  initMiniStar({
    plugins: [
      {
        name: 'trpg',
        url: '/plugins/trpg/index.js',
      },
    ],
  });

  regDependency('react', () => import('react'));
  regDependency('react-router', () => import('react-router'));
  regDependency('react-router-dom', () => import('react-router-dom'));
  regDependency('styled-components', () => import('styled-components'));
  regDependency('immer', () => import('immer'));
  regDependency('lodash/remove', () => import('lodash/remove'));
  regDependency('lodash/find', () => import('lodash/find'));
  regDependency('lodash/isNil', () => import('lodash/isNil'));

  regSharedModule(
    '@capital/web/routes/Main/Content/SidebarItem',
    () => import('./routes/Main/Content/SidebarItem')
  );
  regSharedModule(
    '@capital/web/reg/regPersonalPanel',
    () => import('./reg/regPersonalPanel')
  );
  regSharedModule(
    '@capital/web/components/Iconfont',
    () => import('./components/Iconfont')
  );
  regSharedModule(
    '@capital/web/components/Iconfont',
    () => import('./components/Iconfont')
  );
  regSharedModule('@capital/shared/i18n', () => import('../shared/i18n'));
  regSharedModule(
    '@capital/shared/redux/configureStore/helper',
    () => import('../shared/redux/configureStore/helper')
  );
}
