import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Input } from 'antd';
import { useConverseDetail } from '@redux/hooks/chat';

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

  const placeholder = `给 @${converse?.name} 发消息`;

  const handleSendMsg = useCallback(() => {
    console.log('send msg');
  }, []);

  return (
    <Wrapper>
      <div className="inner">
        <Input placeholder={placeholder} onPressEnter={handleSendMsg} />
      </div>
    </Wrapper>
  );
});
ChatSendBox.displayName = 'ChatSendBox';
