import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SectionHeader } from '../SectionHeader';
import { useConverseDetail } from '@redux/hooks/chat';
import styled from 'styled-components';
import { Space } from 'antd';

const Container = styled.div`
  display: flex;
  font-size: 20px;
`;

const HeaderIdentify = styled.span`
  color: ${(props) => props.theme.color.gray};
  margin-right: 4px;
`;

const HeaderName = styled.span`
  flex: 1;
  font-size: 16px;
  line-height: 32px;
`;

interface ChatHeaderProps {
  converseUUID: string;
  headerActions?: React.ReactNode[];
}
export const ChatHeader: React.FC<ChatHeaderProps> = TMemo((props) => {
  const { converseUUID, headerActions } = props;
  const converse = useConverseDetail(converseUUID);

  return (
    <SectionHeader>
      <Container>
        <HeaderIdentify>
          {['user', 'system'].includes(converse?.type!) ? '@' : '#'}
        </HeaderIdentify>
        <HeaderName>{converse?.name}</HeaderName>

        <Space>{headerActions}</Space>
      </Container>
    </SectionHeader>
  );
});
ChatHeader.displayName = 'ChatHeader';
