import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { CommonPanel } from '../panels/CommonPanel';
import { useConverseDetail, useSelectConverse } from '@redux/hooks/chat';
import { ChatBody } from './ChatBody';
import { ChatLogHistoryAction } from './ChatHeader/ChatLogHistoryAction';

interface Props {
  converseUUID: string;
  converseType: 'user' | 'group' | 'channel';
  style?: React.CSSProperties;
  header?: React.ReactNode;
  headerActions?: React.ReactNode[];
}
export const ChatContainer: React.FC<Props> = TMemo((props) => {
  const {
    converseUUID,
    converseType,
    style,
    header,
    headerActions = [],
  } = props;
  const converse = useConverseDetail(converseUUID);
  useSelectConverse(converseUUID);

  const actions = useMemo(() => {
    if (converseType === 'user') {
      // TODO: 先不在user类型的消息里增加会话历史
      return headerActions;
    } else {
      return [
        ...headerActions,
        <ChatLogHistoryAction
          key="chatlog-history"
          converseUUID={converseUUID}
        />,
      ];
    }
  }, [headerActions, converseType, converseUUID]);

  return (
    <CommonPanel
      type="chat"
      style={style}
      headerPrefix={['user', 'system'].includes(converse?.type!) ? '@' : '#'}
      header={header ?? converse?.name}
      headerActions={actions}
    >
      <ChatBody converseUUID={converseUUID} />
    </CommonPanel>
  );
});
ChatContainer.displayName = 'ChatContainer';
