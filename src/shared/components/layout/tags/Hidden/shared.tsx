import React, { useContext, Fragment, useMemo } from 'react';
import { TagComponent } from '../type';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';
import { TMemo } from '@shared/components/TMemo';

interface TagProps {
  in: 'detail' | 'edit';
  if: any;
}
export const TagHiddenShared: TagComponent<TagProps> = TMemo((props) => {
  const { layoutType } = useContext(LayoutStateContext)!;
  const children = useLayoutChildren(props);

  const isHidden = useMemo(() => layoutType === props.in || props.if === true, [
    props.in,
    props.if,
  ]);

  if (isHidden) {
    return null;
  } else {
    return <Fragment>{children}</Fragment>;
  }
});
TagHiddenShared.displayName = 'TagHiddenShared';
