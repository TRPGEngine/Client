import React, { useContext, Fragment } from 'react';
import { TagComponent } from '../type';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';

interface TagProps {
  in: 'detail' | 'edit';
}
export const TagHiddenShared: TagComponent<TagProps> = React.memo((props) => {
  const { layoutType } = useContext(LayoutStateContext);
  const children = useLayoutChildren(props);

  if (layoutType === props.in) {
    return null;
  } else {
    return <Fragment>{children}</Fragment>;
  }
});
TagHiddenShared.displayName = 'TagHiddenShared';
