import Loadable from 'react-loadable';
import LoadingSpinner from './LoadingSpinner';

type LoaderType<T> = () => Promise<
  React.ComponentType<T> | { default: React.ComponentType<T> }
>;

/**
 * 用法: Loadable(() => import('xxxxxx'))
 * @param loader 需要懒加载的组件
 */
export const TLoadable = <T>(loader: LoaderType<T>) => {
  return Loadable({
    loader,
    loading: LoadingSpinner,
  });
};

export default TLoadable;
