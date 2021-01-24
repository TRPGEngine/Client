import React, { useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Popover, Space } from 'antd';
import { ChatBoxBtn } from '../style';
import { Iconfont } from '../../Iconfont';
import { useChatMsgTypeContext } from '@shared/context/ChatMsgTypeContext';
import styled from 'styled-components';
import type { MsgType } from '@redux/types/chat';
import { useTranslation } from '@shared/i18n';

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
    setMsgType(newType);
    setVisible(false);
  };

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
