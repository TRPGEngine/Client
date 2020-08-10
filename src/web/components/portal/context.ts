import { createContext } from 'react';

export const PortalContext = createContext<{
  ref: React.RefObject<HTMLDivElement>;
} | null>(null);
PortalContext.displayName = 'PortalContext';
