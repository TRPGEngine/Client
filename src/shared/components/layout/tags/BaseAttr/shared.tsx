import React from 'react';
import { useLayoutChildren } from '@shared/components/layout/hooks/useLayoutChildren';
import { LayoutCol } from '@shared/components/layout/tags/Col/shared';
import type { TagComponent } from '../type';
import { TMemo } from '@shared/components/TMemo';

export const TagBaseAttrShared: TagComponent = TMemo((props) => {
  const children = useLayoutChildren(props);

  return (
    <LayoutCol {...props} sm={18} xs={24}>
      {children}
    </LayoutCol>
  );
});
TagBaseAttrShared.displayName = 'TagBaseAttrShared';
