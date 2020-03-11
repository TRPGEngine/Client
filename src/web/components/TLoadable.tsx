import React from 'react';
import Loadable, { LoadingComponentProps } from 'react-loadable';
import LoadingSpinner from './LoadingSpinner';
import { TMemo } from '@shared/components/TMemo';

const Loading: React.FC<LoadingComponentProps> = TMemo((props) => {
  return props.pastDelay && <LoadingSpinner />;
});
Loading.displayName = 'Loading';

type LoaderType<T> = () => Promise<
  React.ComponentType<T> | { default: React.ComponentType<T> }
>;

/**
 * 用法: Loadable(() => import('xxxxxx'))
 * @param loader 需要懒加载的组件
 */
export default function TLoadable<T>(loader: LoaderType<T>) {
  return Loadable({
    loader,
    loading: Loading,
    delay: 200,
  });
}
