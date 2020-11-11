import React, { PropsWithChildren, FunctionComponent } from 'react';

/**
 * 用于处理React.memo不能很好处理displayName的问题
 * https://github.com/facebook/react/issues/17876
 */
export const TMemo = <P extends object>(
  Component: FunctionComponent<P>,
  propsAreEqual?: (
    prevProps: Readonly<PropsWithChildren<P>>,
    nextProps: Readonly<PropsWithChildren<P>>
  ) => boolean
) => {
  const memoized = React.memo(Component, propsAreEqual);

  Object.defineProperty(memoized, 'displayName', {
    set(v) {
      Component.displayName = v;
    },
  });

  return memoized;
};
