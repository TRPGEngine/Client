import React, { useCallback, useState, useRef } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Input } from 'antd';
import { useConverseDetail } from '@redux/hooks/chat';
import { useMsgSend } from './useMsgSend';

const Wrapper = styled.div`
  padding: 0 16px 24px;

  > .inner {
    border-radius: ${(props) => props.theme.radius.card};
    padding: 6px;
    background-color: ${(props) => props.theme.color.graySet[6]};

    .ant-input {
      border: 0;
      background-color: transparent;
      color: ${(props) => props.theme.color.textNormal};
      outline: 0;
      box-shadow: none;
    }
  }
`;

interface ChatSendBoxProps {
  converseUUID: string;
}
export const ChatSendBox: React.FC<ChatSendBoxProps> = TMemo((props) => {
  const { converseUUID } = props;
  const converse = useConverseDetail(converseUUID);
  const { message, setMessage, handleSendMsg, inputRef } = useMsgSend(
    converseUUID
  );
  const prefix = converse?.type === 'user' ? '@' : '#';

  const placeholder = `给 ${prefix}${converse?.name} 发消息`;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  return (
    <Wrapper>
      <div className="inner">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={message}
          onChange={handleInputChange}
          onPressEnter={handleSendMsg}
        />
      </div>
    </Wrapper>
  );
});
ChatSendBox.displayName = 'ChatSendBox';
