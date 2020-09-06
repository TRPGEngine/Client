import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { useConverseDetail } from '@redux/hooks/chat';
import { useInputMsgEditorMsgSend } from './useInputMsgEditorMsgSend';

const Wrapper = styled.div`
  padding: 0 16px 24px;
  font-size: 16px;

  > .inner {
    border-radius: ${(props) => props.theme.radius.card};
    padding: 6px;
    background-color: ${(props) => props.theme.color.graySet[6]};
  }
`;

interface ChatSendBoxProps {
  converseUUID: string;
}
export const ChatSendBox: React.FC<ChatSendBoxProps> = TMemo((props) => {
  const { converseUUID } = props;
  const editorEl = useInputMsgEditorMsgSend(converseUUID);

  return (
    <Wrapper>
      <div className="inner">{editorEl}</div>
    </Wrapper>
  );
});
ChatSendBox.displayName = 'ChatSendBox';
