import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { TRPGEditorNode } from '../../editor/types';
import { buildBlankInputData, getHeadSelection } from '../../editor/utils';
import {
  isArrowDownHotkey,
  isArrowUpHotkey,
  isEnterHotkey,
} from '@web/utils/hot-key';
import { useMsgSend } from '@shared/hooks/useMsgSend';
import { Editor } from 'slate';
import React from 'react';
import { MsgInputEditor } from '../../editor/MsgInputEditor';
import { useConverseDetail } from '@redux/hooks/chat';
import { serializeToBBCode } from '../../editor/utils/serialize/bbcode';
import * as pasteUtils from '@shared/utils/paste-utils';
import { showGlobalLoading, showToasts } from '@shared/manager/ui';
import { insertImage } from '../../editor/changes/insertImage';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import { t } from '@shared/i18n';
import { useSystemSetting } from '@redux/hooks/settings';
import { Input } from 'antd';
import { useMsgHistory } from '@shared/hooks/useMsgHistory';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';

/**
 * 会话消息发送管理
 * @param converseUUID 会话UUID
 */
export function useInputMsgEditorMsgSend(converseUUID: string) {
  const editorRef = useRef<Editor>();
  const { message, setMessage, handleSendMsg, inputRef } = useMsgSend(
    converseUUID
  );
  const [messageData, setMessageData] = useState<TRPGEditorNode[]>(
    buildBlankInputData()
  );
  const converse = useConverseDetail(converseUUID);
  const chatBoxType = useSystemSetting('chatBoxType') ?? 'auto';
  const showRichMsgEditor = useMemo(() => {
    // 是否使用高级输入框
    return chatBoxType !== 'compatible';
  }, [chatBoxType]);
  const {
    switchUp,
    switchDown,
    currentIndex,
    resetIndex,
    addHistoryMsg,
  } = useMsgHistory(converseUUID);
  const msgInputHistorySwitch = useTRPGSelector(
    (state) => state.settings.user.msgInputHistorySwitch ?? true
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isEnterHotkey(e.nativeEvent)) {
        e.preventDefault();

        handleSendMsg();
        if (message !== '') {
          addHistoryMsg(message);
          resetIndex();
        }
      }
      if (
        msgInputHistorySwitch === true &&
        (message === '' || currentIndex !== -1)
      ) {
        // 当上下键快速切换消息历史功能开启时
        // 仅当前信息为空时 或 正在使用上下键切换时, 允许使用上下键切换当前消息
        if (isArrowUpHotkey(e.nativeEvent)) {
          e.preventDefault();
          const newMsg = switchUp();
          if (newMsg !== null) {
            setMessage(newMsg);
          }
        } else if (isArrowDownHotkey(e.nativeEvent)) {
          e.preventDefault();
          const newMsg = switchDown();
          if (newMsg !== null) {
            setMessage(newMsg);
          }
        }
      }
    },
    [
      message,
      handleSendMsg,
      msgInputHistorySwitch,
      switchUp,
      switchDown,
      addHistoryMsg,
      currentIndex,
      resetIndex,
    ]
  );

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (e.clipboardData && e.clipboardData.items) {
        const image = pasteUtils.isPasteImage(e.clipboardData.items);
        if (image) {
          // 上传图片
          e.preventDefault();
          const hideLoading = showGlobalLoading(t('正在上传图片...'));
          try {
            const file = image.getAsFile();
            const chatimgUrl = await pasteUtils.upload(file!);
            if (_isString(chatimgUrl)) {
              if (showRichMsgEditor) {
                // 如果使用的是高级编辑器
                if (!_isNil(editorRef.current)) {
                  insertImage(editorRef.current, chatimgUrl);
                }
              } else {
                // 如果使用的是兼容编辑器
                setMessage(message + `[img]${chatimgUrl}[/img]`);
              }
            }
          } catch (err) {
            showToasts(err, 'error');
          } finally {
            hideLoading();
          }
        }
      }
    },
    [showRichMsgEditor, message]
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
    setMessage(serializeToBBCode(messageData));
  }, [messageData]);

  const handleMessageDataChange = useCallback((data) => {
    setMessageData(data);
  }, []);

  const prefix = converse?.type === 'user' ? '@' : '#';
  const placeholder = `给 ${prefix}${converse?.name} 发消息`;

  const editorEl =
    showRichMsgEditor === true ? (
      <MsgInputEditor
        placeholder={placeholder}
        value={messageData}
        onChange={handleMessageDataChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onEditor={(editor) => (editorRef.current = editor)}
      />
    ) : (
      <Input
        ref={inputRef}
        style={{ paddingTop: 0, paddingBottom: 0 }}
        bordered={false}
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    );

  return { editorRef, editorEl };
}
