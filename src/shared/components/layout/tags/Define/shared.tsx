import React, { useContext, useEffect } from 'react';
import { TagComponent } from '../type';
import {
  useBuildLayoutStateContext,
  useBuildLayoutDefineStateContext,
} from '../../hooks/useBuildLayoutStateContext';
import {
  LayoutStateContextProvider,
  LayoutStateContext,
} from '../../context/LayoutStateContext';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';
import { StateActionType } from '../../types';

interface TagDefineComponentProps {
  name: string;
}
export const TagDefineComponent: TagComponent<TagDefineComponentProps> = React.memo(
  (props) => {
    const parentContext = useContext(LayoutStateContext);
    const { state, dispatch } = useBuildLayoutDefineStateContext(props);
    const children = useLayoutChildren(props);

    return (
      <LayoutStateContextProvider
        state={{
          state,
          dispatch,
          layoutType: parentContext.layoutType,
          parent: parentContext,
        }}
      >
        {children}
      </LayoutStateContextProvider>
    );
  }
);

interface TagProps {
  name: string; // 用于存储数据
}
export const TagDefineShared: TagComponent<TagProps> = React.memo((props) => {
  const context = useContext(LayoutStateContext);
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
