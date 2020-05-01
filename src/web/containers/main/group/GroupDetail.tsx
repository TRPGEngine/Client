import React, { useMemo } from 'react';
import { connect, DispatchProp } from 'react-redux';
import config from '@shared/project.config';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import {
  showModal,
  hideModal,
  showAlert,
  showSlidePanel,
} from '@shared/redux/actions/ui';
import { sendMsg, sendFile } from '@shared/redux/actions/chat';
import {
  changeSelectGroupActor,
  sendGroupInvite,
} from '@shared/redux/actions/group';
import {
  sendDiceRequest,
  sendDiceInvite,
  sendQuickDice,
} from '@shared/redux/actions/dice';
import GroupInvite from './GroupInvite';
import GroupActor from './GroupActor';
import GroupMember from './GroupMember';
import GroupInfo from './GroupInfo';
import DiceRequest from '../dice/DiceRequest';
import DiceInvite from '../dice/DiceInvite';
import ListSelect from '../../../components/ListSelect';
import { MsgContainer } from '../../../components/MsgContainer';
import MsgSendBox from '../../../components/MsgSendBox';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import _orderBy from 'lodash/orderBy';
import {
  GroupActorMsgData,
  GroupActorType,
} from '@src/shared/redux/types/group';
import QuickDice from '../dice/QuickDice';
import { TRPGState } from '@redux/types/__all__';
import GroupRule from './GroupRule';
import { GroupInfoContext } from '@shared/context/GroupInfoContext';
import { UserSelector } from '@web/components/modal/UserSelector';
import { checkIsTestUser } from '@web/utils/debug-helper';
import { GroupChannelCreate } from './modal/GroupChannelCreate';
import { GroupMap } from './GroupMap';
import { MsgDataManager } from '@shared/utils/msg-helper';
import { MsgContainerContextProvider } from '@shared/context/MsgContainerContext';
import { GroupMsgReply } from './GroupMsgReply';
import { MsgType } from '@redux/types/chat';
import { TMemo } from '@shared/components/TMemo';
import {
  useSelectedGroupInfo,
  useSelfGroupActors,
  useSelectedGroupActorUUID,
} from '@redux/hooks/useGroup';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { useCurrentUserUUID } from '@redux/hooks/useUser';
import { getUserInfoCache } from '@shared/utils/cache-helper';
import { getUserName } from '@shared/utils/data-helper';

export const GroupDetail: React.FC = TMemo(() => {
  const groupInfo = useSelectedGroupInfo();
  const groupUUID = groupInfo?.uuid;
  const selectedGroupActorUUID = useSelectedGroupActorUUID(groupUUID);
  const selfGroupActors = useSelfGroupActors(groupUUID);
  const dispatch = useTRPGDispatch();
  const userUUID = useCurrentUserUUID();

  const selectedGroupActorInfo = useMemo(
    () =>
      selfGroupActors.find((actor) => actor.uuid === selectedGroupActorUUID),
    [selfGroupActors, selectedGroupActorUUID]
  );

  const handleSelectGroupActor = (item) => {
    if (item.value !== selectedGroupActorUUID) {
      dispatch(changeSelectGroupActor(groupUUID, item.value));
    }
  };

  const handleSendMsg = (message: string, type: MsgType) => {
    console.log('send msg:', message, 'to', groupUUID);

    const msgDataManager = new MsgDataManager();
    if (!_isNil(selectedGroupActorInfo)) {
      msgDataManager.setGroupActorInfo(selectedGroupActorInfo);
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
  };

  /**
   * 发送邀请入团的邀请
   */
  const handleSendGroupInvite = (uuids: string[]) => {
    for (let uuid of uuids) {
      // TODO: 需要一个待处理的group邀请列表，防止多次提交邀请
      dispatch(sendGroupInvite(groupUUID, uuid));
    }
    dispatch(hideModal());
  };

  // 发送文件
  const handleSendFile = (file: File) => {
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
  };

  // 发送投骰请求
  const handleSendDiceReq = () => {
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
  };

  // 发送投骰邀请
  const handleSendDiceInv = () => {
    const groupMembers = groupInfo.group_members ?? [];
    const list = groupMembers
      .filter((uuid) => uuid !== userUUID)
      .map((uuid) => {
        // TODO: 这里的逻辑不太靠谱。需要优化
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
            let inviteList = list.filter((_, i) => selecteds.indexOf(i) >= 0);
            let inviteNameList = inviteList.map((i) => i.name);
            let inviteUUIDList = inviteList.map((i) => i.uuid);
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
  };

  const handleQuickDice = () => {
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
  };

  const actions = useMemo(() => {
    return [
      ...(checkIsTestUser()
        ? [
            {
              name: '创建频道',
              icon: '&#xe61c;',
              onClick: () => {
                dispatch(
                  showModal(<GroupChannelCreate groupUUID={groupUUID} />)
                );
              },
            },
          ]
        : []),
      {
        name: '添加团员',
        icon: '&#xe61d;',
        onClick: () => {
          dispatch(
            showModal(<UserSelector onConfirm={handleSendGroupInvite} />)
          );
        },
      },
      {
        name: '查看团员',
        icon: '&#xe603;',
        component: <GroupMember />,
      },
      {
        name: '人物卡',
        icon: '&#xe61b;',
        component: <GroupActor />,
      },
      {
        name: '游戏地图',
        icon: '&#xe6d7;',
        component: <GroupMap />,
      },
      {
        name: '游戏规则',
        icon: '&#xe621;',
        component: <GroupRule />,
      },
      {
        name: '团信息',
        icon: '&#xe611;',
        component: <GroupInfo />,
      },
    ];
  }, [dispatch, groupUUID]);

  /**
   * 人物卡列表
   */
  const options = useMemo(() => {
    let list = [];
    if (selfGroupActors && selfGroupActors.length > 0) {
      list = selfGroupActors.map((item) => ({
        value: item.uuid,
        label: item.name,
      }));
    }
    if (selectedGroupActorUUID) {
      list.unshift({
        value: null,
        label: '取消选择',
      });
    }

    return list;
  }, [selfGroupActors, selectedGroupActorUUID]);

  const headerActions = useMemo(
    () =>
      actions.map((item, index) => {
        return (
          <button
            key={'group-action-' + index}
            data-tip={item.name}
            onClick={
              item.onClick ??
              ((e) => {
                e.stopPropagation();
                dispatch(showSlidePanel(item.name, item.component));
              })
            }
          >
            <i
              className="iconfont"
              dangerouslySetInnerHTML={{ __html: item.icon }}
            />
          </button>
        );
      }),
    [actions, dispatch]
  );

  return (
    <GroupInfoContext.Provider value={groupInfo}>
      <MsgContainerContextProvider>
        <div className="detail">
          <ReactTooltip effect="solid" />
          <div className="group-header">
            <div className="avatar">
              <img
                src={
                  groupInfo.avatar || config.defaultImg.getGroup(groupInfo.name)
                }
              />
            </div>
            <div className="title">
              <div className="main-title">
                {groupInfo.name}
                {groupInfo.status && '(开团中...)'}
              </div>
              <div className="sub-title">{groupInfo.sub_name}</div>
            </div>
            <Select
              name="actor-select"
              className="group-actor-select"
              value={selectedGroupActorUUID}
              options={options}
              clearable={false}
              searchable={false}
              placeholder="请选择身份卡"
              noResultsText="暂无身份卡..."
              onChange={handleSelectGroupActor}
            />
            <div className="actions">{headerActions}</div>
          </div>
          <MsgContainer
            className="group-content"
            converseUUID={groupUUID}
            isGroup={true}
          />
          <GroupMsgReply />
          <MsgSendBox
            converseUUID={groupUUID}
            isGroup={true}
            onSendMsg={handleSendMsg}
            onSendFile={handleSendFile}
            onSendDiceReq={handleSendDiceReq}
            onSendDiceInv={handleSendDiceInv}
            onQuickDice={handleQuickDice}
          />
        </div>
      </MsgContainerContextProvider>
    </GroupInfoContext.Provider>
  );
});
GroupDetail.displayName = 'GroupDetail';
