import React, { Fragment } from 'react';
import memoizeOne from 'memoize-one';

/**
 * 获取是否为测试用户
 * 方法是在localStorage上设置 trpg_test: true
 */
const checkIsTestUser = memoizeOne(() => {
  return localStorage.getItem('trpg_test') === 'true';
});

const DevContainer: React.FC<{}> = React.memo((props) => {
  return checkIsTestUser() ? <Fragment>{props.children}</Fragment> : null;
});

export default DevContainer;
