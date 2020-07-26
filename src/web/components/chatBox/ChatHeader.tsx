import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SectionHeader } from '../SectionHeader';
import { useConverseDetail } from '@redux/hooks/chat';
import styled from 'styled-components';

const HeaderIdentify = styled.span`
  color: ${(props) => props.theme.color.gray};
  margin-right: 4px;
  font-size: 20px;
`;

interface ChatHeaderProps {
  converseUUID: string;
}
export const ChatHeader: React.FC<ChatHeaderProps> = TMemo((props) => {
  const converse = useConverseDetail(props.converseUUID);

  return (
    <SectionHeader>
      <HeaderIdentify>@</HeaderIdentify>
      <span>{converse?.name}</span>
    </SectionHeader>
  );
});
ChatHeader.displayName = 'ChatHeader';
