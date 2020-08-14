import React from 'react';

export type PortalMethods = {
  mount: (children: React.ReactNode) => number;
  update: (key: number, children: React.ReactNode) => void;
  unmount: (key: number) => void;
};

export function createPortalContext(name: string) {
  const PortalContext = React.createContext<PortalMethods | null>(null);
  PortalContext.displayName = 'PortalContext-' + name;

  return PortalContext;
}
