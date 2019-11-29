import Loadable from 'react-loadable';
import LoadingSpinner from './LoadingSpinner';

type LoaderType = () => Promise<
  React.ComponentType<unknown> | { default: React.ComponentType<unknown> }
>;

/**
 * 用法: Loadable(() => import('xxxxxx'))
 * @param loader 需要懒加载的组件
 */
export const TLoadable = (loader: LoaderType) => {
  return Loadable({
    loader,
    loading: LoadingSpinner,
  });
};

export default TLoadable;
