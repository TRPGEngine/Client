import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ChatMsgList } from './ChatMsgList';
import { ChatSendBox } from './ChatSendBox';
import { MsgContainerContextProvider } from '@shared/context/MsgContainerContext';
import { GroupMsgReply } from '@web/containers/main/group/GroupMsgReply';
import { CommonPanel } from '../panels/CommonPanel';
import { useConverseDetail } from '@redux/hooks/chat';

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
      <MsgContainerContextProvider>
        <ChatMsgList converseUUID={converseUUID} />
        <GroupMsgReply />
        <ChatSendBox converseUUID={converseUUID} />
      </MsgContainerContextProvider>
    </CommonPanel>
  );
});
ChatContainer.displayName = 'ChatContainer';
