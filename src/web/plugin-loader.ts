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
  regSharedModule(
    '@capital/routes/Main/Content/SidebarItem',
    () => import('./routes/Main/Content/SidebarItem')
  );
}
