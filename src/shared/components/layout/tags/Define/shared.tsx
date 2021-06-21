import React, { useContext, useEffect, useCallback, Fragment } from 'react';
import type { TagComponent } from '../type';
import { useBuildLayoutDefineStateContext } from '../../hooks/useBuildLayoutStateContext';
import {
  LayoutStateContextProvider,
  LayoutStateContext,
} from '../../context/LayoutStateContext';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';
import { StateActionType } from '../../types';
import { TMemo } from '@shared/components/TMemo';

interface TagDefineComponentProps {
  name: string;
}
export const TagDefineComponent: TagComponent<TagDefineComponentProps> = TMemo(
  (props) => {
    const parentContext = useContext(LayoutStateContext)!;
    const { state, dispatch } = useBuildLayoutDefineStateContext(props);

    const ChildrenComponent = useCallback(() => {
      const children = useLayoutChildren(props);
      return <Fragment>{children}</Fragment>;
    }, [props._childrenEl]);

    return (
      <LayoutStateContextProvider
        state={{
          state,
          dispatch,
          layoutType: parentContext.layoutType,
          parent: parentContext,
        }}
      >
        <ChildrenComponent />
      </LayoutStateContextProvider>
    );
  }
);
TagDefineComponent.displayName = 'TagDefineComponent';

interface TagProps {
  name: string; // 用于存储数据
}
export const TagDefineShared: TagComponent<TagProps> = TMemo((props) => {
  const context = useContext(LayoutStateContext)!;
  useEffect(() => {
    context.dispatch({
      type: StateActionType.AddDefine,
      payload: {
        name: props.name,
        component: ({ name, ...useProps }) => {
          return <TagDefineComponent {...props} {...useProps} name={name} />;
        },
      },
    });
  }, []);

  return null;
});
TagDefineShared.displayName = 'TagDefineShared';
