import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useIsMobile } from '@web/hooks/useIsMobile';

export const HiddenInMobile: React.FC = TMemo((props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return <>{props.children}</>;
});
HiddenInMobile.displayName = 'HiddenInMobile';
