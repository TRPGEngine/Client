import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SidebarHeaderText } from './style';

interface SidebarHeaderProps {
  title: string;
  action?: React.ReactNode;
}
export const SidebarHeader: React.FC<SidebarHeaderProps> = TMemo((props) => {
  const { title, action } = props;

  return (
    <SidebarHeaderText>
      <span style={{ flex: 1 }}>{title}</span>
      {action}
    </SidebarHeaderText>
  );
});
SidebarHeader.displayName = 'SidebarHeader';
