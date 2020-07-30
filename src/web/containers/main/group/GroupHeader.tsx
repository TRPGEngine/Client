import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  useSelectedGroupInfo,
  useSelectedGroupActorUUID,
  useSelfGroupActors,
} from '@redux/hooks/group';
import config from '@shared/project.config';
import Select from 'react-select';
import { changeSelectGroupActor, sendGroupInvite } from '@redux/actions/group';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { showSlidePanel, hideModal, showModal } from '@redux/actions/ui';
import { checkIsTestUser } from '@web/utils/debug-helper';
import { GroupChannelCreate } from './modal/GroupChannelCreate';
import { UserSelector } from '@web/components/modal/UserSelector';
import GroupMember from './GroupMember';
import GroupActor from './GroupActor';
import { GroupMap } from './GroupMap';
import GroupRule from './GroupRule';
import GroupInfo from './GroupInfo';

/**
 * 团会话的头部
 */
export const GroupHeader: React.FC = TMemo(() => {
  const groupInfo = useSelectedGroupInfo()!;
  const groupUUID = groupInfo?.uuid!;
  const selectedGroupActorUUID = useSelectedGroupActorUUID(groupUUID);
  const selfGroupActors = useSelfGroupActors(groupUUID);
  const dispatch = useTRPGDispatch();

  const handleSelectGroupActor = (item) => {
    if (item.value !== selectedGroupActorUUID) {
      dispatch(changeSelectGroupActor(groupUUID, item.value));
    }
  };

  /**
   * 人物卡列表
   */
  const options = useMemo(() => {
    let list: {
      value: string | null;
      label: string;
    }[] = [];
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

  /**
   * 发送邀请入团的邀请
   */
  const handleSendGroupInvite = (uuids: string[]) => {
    for (const uuid of uuids) {
      // TODO: 需要一个待处理的group邀请列表，防止多次提交邀请
      dispatch(sendGroupInvite(groupUUID, uuid));
    }
    dispatch(hideModal());
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
  }, [dispatch, groupUUID, handleSendGroupInvite]);
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
    <div className="group-header">
      <div className="avatar">
        <img
          src={groupInfo.avatar || config.defaultImg.getGroup(groupInfo.name)}
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
  );
});
GroupHeader.displayName = 'GroupHeader';
