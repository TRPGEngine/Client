import { initMiniStar } from 'mini-star';

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
}
