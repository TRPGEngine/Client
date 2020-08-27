import { useConverseDetail } from '@redux/hooks/chat';
import { useCallback, useEffect } from 'react';
import { isUserUUID } from '@shared/utils/uuid';
import { sendStopWriting } from '@shared/api/event';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { sendMsg as sendMsgAction } from '@redux/actions/chat';
import { MsgType } from '@redux/types/chat';
import { MsgDataManager } from '@shared/utils/msg-helper';
import _isNil from 'lodash/isNil';
import { useMsgContainerContext } from '@shared/context/MsgContainerContext';
import { useSelectedGroupActorInfo } from '@redux/hooks/group';

export function useMsgSend(converseUUID: string) {
  const converse = useConverseDetail(converseUUID);
  const converseType = converse?.type;
  const dispatch = useTRPGDispatch();
  const { replyMsg, clearReplyMsg } = useMsgContainerContext();

  // 获取选中团角色的信息 仅group类型会话有用
  const selectedGroupActorInfo = useSelectedGroupActorInfo(converseUUID);

  useEffect(() => {
    // 当当前会话发生变化时，清空回复消息
    clearReplyMsg();
  }, [converseUUID]);

  /**
   * 发送消息到远程服务器
   */
  const sendMsg = useCallback(
    (message: string, type: MsgType) => {
      if (converseType === 'user') {
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
          })
        );
      } else if (converseType === 'group') {
        sendStopWriting('group', converseUUID);

        const msgDataManager = new MsgDataManager();

        // 选中的角色
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
            message,
            is_public: true,
            is_group: true,
            type,
            data: msgDataManager.toJS(),
          })
        );
      }
    },
    [
      converseUUID,
      converseType,
      selectedGroupActorInfo,
      replyMsg,
      clearReplyMsg,
    ]
  );

  return { sendMsg };
}
