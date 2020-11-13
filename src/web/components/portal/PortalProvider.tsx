import React, { useRef } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { PortalContext } from './context';

/**
 * @deprecated 应当使用@web/utils/portal
 */
export const PortalProvider: React.FC = TMemo((props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <PortalContext.Provider value={{ ref: containerRef }}>
      {props.children}
      <div
        ref={containerRef}
        style={{ position: 'absolute', left: 0, top: 0 }}
      />
    </PortalContext.Provider>
  );
});
PortalProvider.displayName = 'PortalProvider';
