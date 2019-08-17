import Loadable from 'react-loadable';
import LoadingSpinner from './LoadingSpinner';
import { ComponentType } from 'react';

/**
 * 用法: Loadable(() => import('xxxxxx'))
 * @param loader 需要懒加载的组件
 */
export const TLoadable = (loader: any) => {
  return Loadable({
    loader,
    loading: LoadingSpinner,
  });
};

export default TLoadable;
