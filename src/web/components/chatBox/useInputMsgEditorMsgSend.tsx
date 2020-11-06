import { useState, useCallback, useEffect, useRef } from 'react';
import { TRPGEditorNode } from '../editor/types';
import { buildBlankInputData, getHeadSelection } from '../editor/utils';
import { isEnterHotkey } from '@web/utils/hot-key';
import { useMsgSend } from '@shared/hooks/useMsgSend';
import { Editor } from 'slate';
import React from 'react';
import { MsgInputEditor } from '../editor/MsgInputEditor';
import { useConverseDetail } from '@redux/hooks/chat';
import { serializeToBBCode } from '../editor/utils/serialize/bbcode';
import * as pasteUtils from '@shared/utils/paste-utils';
import { showToasts } from '@shared/manager/ui';
import { insertImage } from '../editor/changes/insertImage';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';

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

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (e.clipboardData && e.clipboardData.items) {
        const image = pasteUtils.isPasteImage(e.clipboardData.items);
        if (image) {
          // 上传图片
          e.preventDefault();
          try {
            const file = image.getAsFile();
            const chatimgUrl = await pasteUtils.upload(file!);
            if (!_isNil(editorRef.current) && _isString(chatimgUrl)) {
              insertImage(editorRef.current, chatimgUrl);
            }
          } catch (err) {
            showToasts(err, 'error');
          }
        }
      }
    },
    []
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
      onPaste={handlePaste}
      onEditor={(editor) => (editorRef.current = editor)}
    />
  );

  return { editorRef, editorEl };
}
