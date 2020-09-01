import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { CommonPanel } from '../panels/CommonPanel';
import { useConverseDetail } from '@redux/hooks/chat';
import { ChatBody } from './ChatBody';

interface Props {
  converseUUID: string;
  style?: React.CSSProperties;
  headerActions?: React.ReactNode[];
  rightPanel?: React.ReactNode;
}
export const ChatContainer: React.FC<Props> = TMemo((props) => {
  const { converseUUID, style, headerActions, rightPanel } = props;
  const converse = useConverseDetail(converseUUID);

  return (
    <CommonPanel
      style={style}
      headerPrefix={['user', 'system'].includes(converse?.type!) ? '@' : '#'}
      header={converse?.name}
      rightPanel={rightPanel}
      headerActions={headerActions}
    >
      <ChatBody converseUUID={converseUUID} />
    </CommonPanel>
  );
});
ChatContainer.displayName = 'ChatContainer';
