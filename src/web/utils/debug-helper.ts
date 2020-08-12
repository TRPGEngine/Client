import memoizeOne from 'memoize-one';

/**
 * 获取是否为测试用户
 * 方法是在localStorage上设置 trpg_test: true
 */
export const checkIsTestUser = memoizeOne(() => {
  return localStorage.getItem('trpg_test') === 'true';
});

/**
 * 获取是否使用新的界面
 */
export const checkIsNewApp = memoizeOne(() => {
  return localStorage.getItem('__isNewApp') === 'true';
});
