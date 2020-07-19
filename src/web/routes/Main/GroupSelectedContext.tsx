import React, { useContext } from 'react';

/**
 * 记录选中团的UUID
 */

interface Props {
  uuid: string;
}
export const GroupSelectedContext = React.createContext<Props>(null);
GroupSelectedContext.displayName = 'GroupSelectedContext';

export function useGroupSelectedContext(): string {
  const context = useContext(GroupSelectedContext);

  return context.uuid;
}
