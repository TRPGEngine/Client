import Loadable from 'react-loadable';
import LoadingSpinner from './components/LoadingSpinner';

// 用法: Loadable(() => import('xxxxxx'))
export const TLoadable = (loader) => {
  return Loadable({
    loader,
    loading: LoadingSpinner,
  });
};

export default TLoadable;
