import { TMemo } from '@shared/components/TMemo';
import { ChatHistory } from '@web/components/ChatHistory';
import { Iconfont } from '@web/components/Iconfont';
import { useRightPanelContext } from '@web/components/panels/context/RightPanelContext';
import React, { useCallback } from 'react';

const ACTION_NAME = 'chatlog-history';

interface Props {
  converseUUID: string;
}

const ChatLogHistory: React.FC<Props> = TMemo((props) => {
  const { converseUUID } = props;

  return <ChatHistory groupUUID={converseUUID} converseUUID={converseUUID} />;
});
ChatLogHistory.displayName = 'ChatLogHistory';

/**
 * 通用会话聊天记录
 *
 * 包括私人会话, 团会话, 团频道会话
 */
export const ChatLogHistoryAction: React.FC<Props> = TMemo((props) => {
  const { converseUUID } = props;
  const {
    rightPanelName,
    setRightPanel,
    resetRightPanel,
  } = useRightPanelContext();

  const handleClick = useCallback(() => {
    if (rightPanelName === ACTION_NAME) {
      resetRightPanel();
    } else {
      setRightPanel(
        ACTION_NAME,
        <ChatLogHistory converseUUID={converseUUID} />
      );
    }
  }, [rightPanelName, setRightPanel, resetRightPanel, converseUUID]);

  return (
    <Iconfont active={rightPanelName === ACTION_NAME} onClick={handleClick}>
      &#xe652;
    </Iconfont>
  );
});
ChatLogHistoryAction.displayName = 'ChatLogHistoryAction';
