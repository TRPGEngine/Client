import React from 'react';
import loadable, {
  DefaultComponent,
  LoadableComponent,
  OptionsWithoutResolver,
} from '@loadable/component';
import pMinDelay from 'p-min-delay';

/**
 * 用法: Loadable(() => import('xxxxxx'))
 * @param loader 需要懒加载的组件
 */
export function TLoadable<Props>(
  loadFn: (props: Props) => Promise<DefaultComponent<Props>>,
  options?: OptionsWithoutResolver<Props>
): LoadableComponent<Props> {
  return loadable((props) => pMinDelay(loadFn(props), 200));
}

export default TLoadable;
