import React, { useCallback, useState, useRef } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Input } from 'antd';
import { useConverseDetail } from '@redux/hooks/chat';
import { useMsgSend } from './useMsgSend';

const Wrapper = styled.div`
  padding: 0 16px 24px;

  .inner {
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
  const [msg, setMsg] = useState('');
  const inputRef = useRef<Input>();
  const { sendMsg } = useMsgSend(converseUUID);

  const placeholder = `给 @${converse?.name} 发消息`;

  const handleSendMsg = useCallback(() => {
    const type = 'normal';
    if (!!msg) {
      sendMsg(msg, type);
      inputRef.current.focus();
      setMsg('');
    }
  }, [msg, sendMsg]);

  return (
    <Wrapper>
      <div className="inner">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onPressEnter={handleSendMsg}
        />
      </div>
    </Wrapper>
  );
});
ChatSendBox.displayName = 'ChatSendBox';
