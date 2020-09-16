import React, { useMemo, useCallback, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { showModal, hideModal, showAlert } from '@shared/redux/actions/ui';
import { sendMsg, sendFile } from '@shared/redux/actions/chat';
import {
  sendDiceRequest,
  sendDiceInvite,
  sendQuickDice,
} from '@shared/redux/actions/dice';
import DiceRequest from '../dice/DiceRequest';
import DiceInvite from '../dice/DiceInvite';
import ListSelect from '../../../components/ListSelect';
import { MsgContainer } from '../../../components/MsgContainer';
import MsgSendBox from '../../../components/MsgSendBox';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import _orderBy from 'lodash/orderBy';
import QuickDice from '../dice/QuickDice';
import { GroupInfoContext } from '@shared/context/GroupInfoContext';
import { MsgDataManager } from '@shared/utils/msg-helper';
import { useMsgContainerContext } from '@shared/context/MsgContainerContext';
import { GroupMsgReply } from './GroupMsgReply';
import { MsgType } from '@redux/types/chat';
import { TMemo } from '@shared/components/TMemo';
import {
  useSelectedGroupInfo,
  useSelectedGroupActorInfo,
} from '@redux/hooks/group';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { useCurrentUserUUID } from '@redux/hooks/user';
import { getUserInfoCache } from '@shared/utils/cache-helper';
import { getUserName } from '@shared/utils/data-helper';
import { GroupHeader } from './GroupHeader';
import { ChatWritingIndicator } from '@web/components/ChatWritingIndicator';
import { sendStartWriting, sendStopWriting } from '@shared/api/event';
import { useWritingState } from '@redux/hooks/chat';

export const GroupDetail: React.FC = TMemo(() => {
  const groupInfo = useSelectedGroupInfo();
  const groupUUID = groupInfo?.uuid!;
  const dispatch = useTRPGDispatch();
  const userUUID = useCurrentUserUUID();
  const { replyMsg, clearReplyMsg } = useMsgContainerContext();
  const selectedGroupActorInfo = useSelectedGroupActorInfo(groupUUID);

  useEffect(() => {
    // 当当前groupUUID发生变化时，清空回复消息
    clearReplyMsg();
  }, [groupUUID]);

  const handleSendBoxChange = useCallback(
    (text) => {
      if (text === '') {
        sendStopWriting('group', groupUUID);
      } else {
        sendStartWriting('group', groupUUID, text);
      }
    },
    [groupUUID]
  );

  const handleSendMsg = useCallback(
    (message: string, type: MsgType) => {
      console.log('send msg:', message, 'to', groupUUID);

      const msgDataManager = new MsgDataManager();
      if (!_isNil(selectedGroupActorInfo)) {
        msgDataManager.setGroupActorInfo(selectedGroupActorInfo);
      }
      if (!_isNil(replyMsg)) {
        msgDataManager.setReplyMsg(replyMsg);
        clearReplyMsg();
      }

      dispatch(
        sendMsg(null, {
          converse_uuid: groupUUID,
          message,
          is_public: true,
          is_group: true,
          type,
          data: msgDataManager.toJS(),
        })
      );

      sendStopWriting('group', groupUUID);
    },
    [dispatch, groupUUID, selectedGroupActorInfo, replyMsg, clearReplyMsg]
  );

  // 发送文件
  const handleSendFile = useCallback(
    (file: File) => {
      console.log('send file to', groupUUID, file);
      dispatch(
        sendFile(
          null,
          {
            converse_uuid: groupUUID,
            is_public: true,
            is_group: true,
          },
          file
        )
      );
    },
    [dispatch, groupUUID]
  );

  // 发送投骰请求
  const handleSendDiceReq = useCallback(() => {
    dispatch(
      showModal(
        <DiceRequest
          onSendDiceRequest={(diceReason, diceExp) => {
            dispatch(sendDiceRequest(groupUUID, true, diceExp, diceReason));
            dispatch(hideModal());
          }}
        />
      )
    );
  }, [dispatch, groupUUID]);

  // 发送投骰邀请
  const handleSendDiceInv = useCallback(() => {
    const groupMembers = groupInfo?.group_members ?? [];
    const list = groupMembers
      .filter((uuid) => uuid !== userUUID)
      .map((uuid) => {
        // TODO: 这里使用getUserInfoCache的逻辑不太靠谱。需要优化
        const cacheUserInfo = getUserInfoCache(uuid);
        return {
          name: getUserName(cacheUserInfo),
          uuid: cacheUserInfo?.uuid,
        };
      });
    dispatch(
      showModal(
        <ListSelect
          list={list.map((i) => i.name)}
          onListSelect={(selecteds) => {
            const inviteList = list.filter((_, i) => selecteds.indexOf(i) >= 0);
            const inviteNameList = inviteList.map((i) => i.name);
            const inviteUUIDList = inviteList.map((i) => i.uuid);
            if (inviteNameList.length === 0) {
              dispatch(showAlert('请选择邀请对象'));
              return;
            }
            console.log('邀请人物选择结果', selecteds, inviteNameList);
            dispatch(
              showModal(
                <DiceInvite
                  inviteList={inviteNameList}
                  onSendDiceInvite={(diceReason, diceExp) => {
                    console.log(inviteUUIDList);
                    console.log('diceReason, diceExp', diceReason, diceExp);
                    dispatch(
                      sendDiceInvite(
                        groupUUID,
                        true,
                        diceExp,
                        diceReason,
                        inviteUUIDList,
                        inviteNameList
                      )
                    );
                    dispatch(hideModal());
                  }}
                />
              )
            );
          }}
        />
      )
    );
  }, [dispatch, groupInfo, userUUID, groupUUID]);

  const handleQuickDice = useCallback(() => {
    console.log('快速投骰');
    dispatch(
      showModal(
        <QuickDice
          onSendQuickDice={(diceExp) => {
            dispatch(sendQuickDice(groupUUID, true, diceExp));
            dispatch(hideModal());
          }}
        />
      )
    );
  }, [dispatch, groupUUID]);

  const writingList = useWritingState(groupUUID);

  return (
    <GroupInfoContext.Provider value={groupInfo}>
      <div className="detail">
        <ReactTooltip effect="solid" />
        <GroupHeader />
        <ChatWritingIndicator list={writingList} />
        <MsgContainer
          className="group-content"
          converseUUID={groupUUID}
          isGroup={true}
        />
        <GroupMsgReply />
        <MsgSendBox
          converseUUID={groupUUID}
          isGroup={true}
          onChange={handleSendBoxChange}
          onSendMsg={handleSendMsg}
          onSendFile={handleSendFile}
          onSendDiceReq={handleSendDiceReq}
          onSendDiceInv={handleSendDiceInv}
          onQuickDice={handleQuickDice}
        />
      </div>
    </GroupInfoContext.Provider>
  );
});
GroupDetail.displayName = 'GroupDetail';
