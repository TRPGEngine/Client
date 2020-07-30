import React, { useContext } from 'react';

/**
 * 记录选中团的UUID
 */

interface Props {
  uuid: string;
}
export const GroupSelectedContext = React.createContext<Props | null>(null);
GroupSelectedContext.displayName = 'GroupSelectedContext';

export function useGroupSelectedContext(): string | undefined {
  const context = useContext(GroupSelectedContext);

  return context?.uuid;
}
