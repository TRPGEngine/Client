import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { useInputMsgEditorMsgSend } from './useInputMsgEditorMsgSend';
import { ChatMsgAddon } from './ChatMsgAddon';
import { ChatMsgEmotion } from './ChatMsgEmotion';
import { Space } from 'antd';

import './ChatMsg.less';

const Wrapper = styled.div`
  padding: 0 16px 24px;
  font-size: 16px;

  > .outer {
    border-radius: ${(props) => props.theme.radius.card};
    background-color: ${(props) => props.theme.color.graySet[6]};
    padding: 6px;
    display: flex;

    > .inner {
      flex: 1;
    }
  }
`;

interface ChatSendBoxProps {
  converseUUID: string;
}
export const ChatSendBox: React.FC<ChatSendBoxProps> = TMemo((props) => {
  const { converseUUID } = props;
  const { editorRef, editorEl } = useInputMsgEditorMsgSend(converseUUID);

  return (
    <Wrapper>
      <div className="outer">
        <div className="inner">{editorEl}</div>

        <Space>
          <ChatMsgEmotion editorRef={editorRef} />
          <ChatMsgAddon editorRef={editorRef} />
        </Space>
      </div>
    </Wrapper>
  );
});
ChatSendBox.displayName = 'ChatSendBox';
