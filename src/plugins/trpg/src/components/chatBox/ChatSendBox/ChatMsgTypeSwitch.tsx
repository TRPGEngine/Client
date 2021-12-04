import React, { useState } from 'react';
import { TMemo } from '@capital/shared/components/TMemo';
import { Popover, Space } from 'antd';
import { ChatBoxBtn } from '@capital/web/components/chatBox/style';
import { Iconfont } from '@capital/web/components/Iconfont';
import { useChatMsgTypeContext } from '@capital/shared/context/ChatMsgTypeContext';
import styled from 'styled-components';
import type { MsgType } from '@capital/shared/redux/types/chat';
import { useTranslation } from '@capital/shared/i18n';
import { trackEvent } from '@capital/web/utils/analytics-helper';
import { useGlobalKeyDown } from '@capital/web/hooks/useGlobalKeyDown';
import { isAlt1, isAlt2, isAlt3, isAlt4 } from '@capital/web/utils/hot-key';

const ChatMsgTypeSwitchPopoverContainer = styled(Space)`
  padding: 6px 10px;

  > div {
    font-size: 20px;
    cursor: pointer;
  }
`;

export const ChatMsgTypeSwitch: React.FC = TMemo((props) => {
  const [visible, setVisible] = useState(false);
  const { msgType, setMsgType } = useChatMsgTypeContext();
  const { t } = useTranslation();

  const normalIcon = <Iconfont>&#xe72d;</Iconfont>;
  const oocIcon = <Iconfont>&#xe64d;</Iconfont>;
  const speakIcon = <Iconfont>&#xe61f;</Iconfont>;
  const actionIcon = <Iconfont>&#xe619;</Iconfont>;

  const handleSwitchMsgType = (newType: MsgType) => {
    trackEvent('chat:switchMsgType', { newType, oldType: msgType });
    setMsgType(newType);
    setVisible(false);
  };

  /**
   * 会话消息类型的快捷键
   */
  useGlobalKeyDown((e) => {
    if (isAlt1(e)) {
      setMsgType('normal');
    } else if (isAlt2(e)) {
      setMsgType('ooc');
    } else if (isAlt3(e)) {
      setMsgType('speak');
    } else if (isAlt4(e)) {
      setMsgType('action');
    }
  });

  const content = (
    <ChatMsgTypeSwitchPopoverContainer>
      <div title={t('普通信息')} onClick={() => handleSwitchMsgType('normal')}>
        {normalIcon}
      </div>
      <div title={t('吐槽信息')} onClick={() => handleSwitchMsgType('ooc')}>
        {oocIcon}
      </div>
      <div title={t('对话信息')} onClick={() => handleSwitchMsgType('speak')}>
        {speakIcon}
      </div>
      <div title={t('行动信息')} onClick={() => handleSwitchMsgType('action')}>
        {actionIcon}
      </div>
    </ChatMsgTypeSwitchPopoverContainer>
  );

  const currentTypeNode =
    msgType === 'ooc'
      ? oocIcon
      : msgType === 'speak'
      ? speakIcon
      : msgType === 'action'
      ? actionIcon
      : normalIcon;

  return (
    <Popover
      visible={visible}
      onVisibleChange={setVisible}
      overlayClassName="chat-sendbox-addon-popover"
      placement="top"
      trigger="click"
      content={content}
    >
      <ChatBoxBtn>{currentTypeNode}</ChatBoxBtn>
    </Popover>
  );
});
ChatMsgTypeSwitch.displayName = 'ChatMsgTypeSwitch';
