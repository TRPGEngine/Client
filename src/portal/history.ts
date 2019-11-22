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

export default history;
