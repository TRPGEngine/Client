import { useConverseDetail } from '@redux/hooks/chat';
import {
  useCallback,
  useEffect,
  useContext,
  useState,
  useRef,
  useMemo,
} from 'react';
import { isUserUUID } from '@shared/utils/uuid';
import { sendStopWriting, sendStartWriting } from '@shared/api/event';
import { useTRPGDispatch } from '@redux/hooks/useTRPGSelector';
import { sendMsg as sendMsgAction } from '@redux/actions/chat';
import type { MsgType } from '@redux/types/chat';
import { MsgDataManager, preProcessMessage } from '@shared/utils/msg-helper';
import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';
import { useMsgContainerContext } from '@shared/context/MsgContainerContext';
import { useSelectedGroupActorInfo } from '@redux/hooks/group';
import {
  GroupInfoContext,
  useCurrentGroupUUID,
} from '@shared/context/GroupInfoContext';
import { showToasts } from '@shared/manager/ui';
import { useChatMsgTypeContext } from '@shared/context/ChatMsgTypeContext';
import { t } from '@shared/i18n';

/**
 * 消息输入相关事件
 * @param converseUUID 会话UUID
 */
export function useMsgSend(converseUUID: string) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<any>(null);
  const converse = useConverseDetail(converseUUID);
  const converseType = converse?.type;
  const dispatch = useTRPGDispatch();
  const { replyMsg, clearReplyMsg, scrollToBottom } = useMsgContainerContext();
  const currentGroupUUID = useCurrentGroupUUID();
  const { msgType } = useChatMsgTypeContext();

  // 获取选中团角色的信息 仅group类型会话有用
  const selectedGroupActorInfo = useSelectedGroupActorInfo(
    currentGroupUUID ?? ''
  );

  useEffect(() => {
    // 当当前会话发生变化时，清空回复消息
    clearReplyMsg();
  }, [converseUUID]);

  /**
   * 发送消息到远程服务器
   */
  const sendMsg = useCallback(
    (message: string, type: MsgType, data?: {}) => {
      message = preProcessMessage(message);

      if (message === '') {
        // 如果处理后消息为空则跳出
        showToasts(t('消息不能为空'), 'warning');
        return;
      }

      if (converseType === 'user' || converseType === 'system') {
        if (isUserUUID(converseUUID)) {
          // 通知服务器告知converseUUID当前用户停止输入
          sendStopWriting('user', converseUUID);
        }

        dispatch(
          sendMsgAction(converseUUID, {
            message,
            is_public: false,
            is_group: false,
            type,
            data,
          })
        );
      } else if (converseType === 'group' || converseType === 'channel') {
        sendStopWriting('group', converseUUID);

        const msgDataManager = new MsgDataManager();

        // 选中的角色
        // TODO: Not good
        if (!_isNil(selectedGroupActorInfo)) {
          msgDataManager.setGroupActorInfo(selectedGroupActorInfo);
        }

        // 回复消息
        if (!_isNil(replyMsg)) {
          msgDataManager.setReplyMsg(replyMsg);
          clearReplyMsg();
        }

        dispatch(
          sendMsgAction(null, {
            converse_uuid: converseUUID,
            group_uuid: currentGroupUUID,
            message,
            is_public: true,
            is_group: true,
            type,
            data: {
              ...msgDataManager.toJS(),
              ...data,
            },
          })
        );
      }

      inputRef.current?.focus();
      requestAnimationFrame(() => {
        _isFunction(scrollToBottom) && scrollToBottom();
      });
    },
    [
      converseUUID,
      converseType,
      selectedGroupActorInfo,
      replyMsg,
      clearReplyMsg,
      currentGroupUUID,
      scrollToBottom,
    ]
  );

  /**
   * 发送卡片消息到远程服务器
   */
  const sendCardMsg = useCallback(
    (cardType: string, otherData: {}, message: string = t('[卡片消息]')) => {
      sendMsg(message, 'card', {
        ...otherData,
        type: cardType,
      });
    },
    [sendMsg]
  );

  const handleSendMsg = useCallback(() => {
    if (!!message) {
      sendMsg(message, msgType ?? 'normal');
      setMessage('');
    }
  }, [message, sendMsg, msgType]);

  // 发送输入状态
  useEffect(() => {
    if (message === '') {
      sendStopWriting(converseType, converseUUID);
    } else {
      sendStartWriting(converseType, converseUUID, message);
    }
  }, [converseType, message]);

  return { message, setMessage, handleSendMsg, inputRef, sendMsg, sendCardMsg };
}
