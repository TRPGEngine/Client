import type { ComponentType } from 'react';

/**
 * 容器配置
 */
export interface FastFormContainerProps {
  loading: boolean;
  submitLabel?: string;
  handleSubmit: () => void;
}
export type FastFormContainerComponent = React.ComponentType<
  FastFormContainerProps
>;
let FastFormContainer: FastFormContainerComponent;
export function regFormContainer(component: FastFormContainerComponent) {
  FastFormContainer = component;
}

export function getFormContainer():
  | ComponentType<FastFormContainerProps>
  | undefined {
  return FastFormContainer;
}
