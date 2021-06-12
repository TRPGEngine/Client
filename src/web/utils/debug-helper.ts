import memoizeOne from 'memoize-one';
import { IS_NEW_APP, IS_DEVELOPER } from '@shared/utils/consts';
import { showToasts } from '@shared/manager/ui';

/**
 * 获取是否为测试用户
 * 方法是手动在 localStorage上设置 __isDeveloper: true
 */
export const checkIsDeveloper = memoizeOne(() => {
  return localStorage.getItem(IS_DEVELOPER) === 'true';
});

/**
 * 切换APP
 * @param toNewApp 是否切换到新版
 */
export function switchToAppVersion(toNewApp = true) {
  localStorage.setItem(IS_NEW_APP, String(toNewApp));

  showToasts('切换成功, 1秒后回到首页');
  setTimeout(() => {
    window.location.href = '/'; // 刷新页面并回到首页
  }, 1000);
}
