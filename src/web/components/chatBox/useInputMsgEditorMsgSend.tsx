import { useState, useCallback, useEffect, useRef } from 'react';
import { TRPGEditorNode } from '../editor/types';
import { buildBlankInputData, getHeadSelection } from '../editor/utils';
import { isEnterHotkey } from '@web/utils/hot-key';
import { useMsgSend } from '@shared/hooks/useMsgSend';
import { Editor } from 'slate';
import React from 'react';
import { MsgInputEditor } from '../editor/MsgInputEditor';
import { useConverseDetail } from '@redux/hooks/chat';
import styled from 'styled-components';
import { serializeToBBCode } from '../editor/utils/serialize/bbcode';

export function useInputMsgEditorMsgSend(converseUUID: string) {
  const editorRef = useRef<Editor>();
  const { message, setMessage, handleSendMsg, inputRef } = useMsgSend(
    converseUUID
  );
  const [messageData, setMessageData] = useState<TRPGEditorNode[]>(
    buildBlankInputData()
  );
  const converse = useConverseDetail(converseUUID);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isEnterHotkey(e.nativeEvent)) {
        e.preventDefault();
        handleSendMsg();
      }
    },
    [handleSendMsg]
  );

  useEffect(() => {
    if (message === '') {
      // 清空输入框信息
      if (editorRef.current) {
        editorRef.current.selection = getHeadSelection();
      }
      setMessageData(buildBlankInputData());
    }
  }, [message]);

  useEffect(() => {
    setMessage(serializeToBBCode({ children: messageData }));
  }, [messageData]);

  const handleMessageDataChange = useCallback((data) => {
    setMessageData(data);
  }, []);

  const prefix = converse?.type === 'user' ? '@' : '#';
  const placeholder = `给 ${prefix}${converse?.name} 发消息`;

  const editorEl = (
    <MsgInputEditor
      placeholder={placeholder}
      value={messageData}
      onChange={handleMessageDataChange}
      onKeyDown={handleKeyDown}
      onEditor={(editor) => (editorRef.current = editor)}
    />
  );

  return editorEl;
}
