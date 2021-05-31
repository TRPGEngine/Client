import React, { useCallback, useState } from 'react';
import { TMemo } from '@capital/shared/components/TMemo';
import { Iconfont } from '@capital/web/components/Iconfont';
import { Button, Popover, Tooltip } from 'antd';
import { ChatBoxBtn } from '@capital/web/components/chatBox/style';
import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';
import { trackEvent } from '@capital/web/utils/analytics-helper';
import { useChatSendBoxContext } from '@capital/web/components/chatBox/ChatSendBox/ChatSendBoxContext';
import { reportError } from '@capital/web/utils/error';

export const ChatMsgDiceBuilder: React.FC = TMemo(() => {
  const chatSendBoxContext = useChatSendBoxContext();
  const [visible, setVisible] = useState(false);

  const handleSendDice = useCallback(
    (expressStr: string) => {
      if (_isFunction(chatSendBoxContext?.sendMsg)) {
        chatSendBoxContext?.sendMsg(expressStr, 'normal');
        setVisible(false);
        trackEvent('chat:quickdice', { expressStr });
      } else {
        reportError('无法获取到消息上下文中的sendMsg');
      }
    },
    [chatSendBoxContext?.sendMsg]
  );

  const content = (
    <div>
      {/* TODO: 常用骰 */}

      {/* <Divider /> */}

      {/* 默认骰 */}
      <Tooltip title="1d4">
        <Button
          icon={<Iconfont>&#xe626;</Iconfont>}
          onClick={() => handleSendDice('.r1d4')}
        />
      </Tooltip>
      <Tooltip title="1d6">
        <Button
          icon={<Iconfont>&#xe628;</Iconfont>}
          onClick={() => handleSendDice('.r1d6')}
        />
      </Tooltip>
      <Tooltip title="1d8">
        <Button
          icon={<Iconfont>&#xe627;</Iconfont>}
          onClick={() => handleSendDice('.r1d8')}
        />
      </Tooltip>
      <Tooltip title="1d10">
        <Button
          icon={<Iconfont>&#xe62b;</Iconfont>}
          onClick={() => handleSendDice('.r1d10')}
        />
      </Tooltip>
      <Tooltip title="1d12">
        <Button
          icon={<Iconfont>&#xe62a;</Iconfont>}
          onClick={() => handleSendDice('.r1d12')}
        />
      </Tooltip>
      <Tooltip title="1d20">
        <Button
          icon={<Iconfont>&#xe629;</Iconfont>}
          onClick={() => handleSendDice('.r1d20')}
        />
      </Tooltip>
      <Tooltip title="1d100">
        <Button
          icon={<Iconfont>&#xe62c;</Iconfont>}
          onClick={() => handleSendDice('.r1d100')}
        />
      </Tooltip>
    </div>
  );

  return (
    <Popover
      visible={visible}
      onVisibleChange={setVisible}
      overlayClassName="chat-sendbox-addon-popover"
      placement="topRight"
      trigger="click"
      content={content}
    >
      <ChatBoxBtn>
        <Iconfont>&#xe629;</Iconfont>
      </ChatBoxBtn>
    </Popover>
  );
});
ChatMsgDiceBuilder.displayName = 'ChatMsgDiceBuilder';
