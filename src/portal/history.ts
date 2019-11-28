import { createBrowserHistory } from 'history';

const history = createBrowserHistory({
  basename: '/portal',
});

/**
 * 跳转到相应地址
 * @param url 地址
 */
export const nav = (url: string) => {
  history.push(url);
};

/**
 * 替换当前地址到相应地址
 * @param url 地址
 */
export const navReplace = (url: string) => {
  history.replace(url);
};

export default history;
