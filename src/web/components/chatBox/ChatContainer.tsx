import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { CommonPanel } from '../panels/CommonPanel';
import { useConverseDetail, useSelectConverse } from '@redux/hooks/chat';
import { ChatBody } from './ChatBody';

interface Props {
  converseUUID: string;
  style?: React.CSSProperties;
  header?: React.ReactNode;
  headerActions?: React.ReactNode[];
}
export const ChatContainer: React.FC<Props> = TMemo((props) => {
  const { converseUUID, style, header, headerActions } = props;
  const converse = useConverseDetail(converseUUID);
  useSelectConverse(converseUUID);

  return (
    <CommonPanel
      style={style}
      headerPrefix={['user', 'system'].includes(converse?.type!) ? '@' : '#'}
      header={header ?? converse?.name}
      headerActions={headerActions}
    >
      <ChatBody converseUUID={converseUUID} />
    </CommonPanel>
  );
});
ChatContainer.displayName = 'ChatContainer';
