import React, { Fragment, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Typography, Tooltip, Result, Button } from 'antd';
import { PillTabs } from '@web/components/PillTabs';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import {
  useJoinedGroupInfo,
  useIsGroupManager,
  useSelfGroupActors,
  useGroupDetailValue,
} from '@redux/hooks/group';
import {
  getGroupActorField,
  getGroupActorInfo,
  getGroupActorTemplateUUID,
} from '@shared/utils/data-helper';
import { showToasts } from '@shared/manager/ui';
import ActorInfo from '@web/components/modals/ActorInfo';
import { openModal, ModalWrapper, closeModal } from '@web/components/Modal';
import { GroupActorType } from '@redux/types/group';
import { Iconfont } from '@web/components/Iconfont';
import ActorEdit from '@web/components/modals/ActorEdit';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import {
  requestAddGroupActor,
  removeGroupActor,
  updateGroupActorInfo,
} from '@redux/actions/group';
import { showAlert } from '@redux/actions/ui';
import { ActorCard, ActorCardListContainer } from '@web/components/ActorCard';
import { GroupActorCheck } from '@web/containers/main/group/modal/GroupActorCheck';
import ActorSelect from '@web/components/modals/ActorSelect';
import { editGroupActor } from '@shared/model/group';
import { useTranslation } from '@shared/i18n';
const TabPane = PillTabs.TabPane;

/**
 * 是否允许显示团角色面板
 * 如果是管理员则全部显示
 * 如果不是管理员。则仅未打开 disable_check_actor 时显示
 * @param groupUUID 团UUID
 */
function useAllowDisplayActorPanel(groupUUID: string): boolean {
  const disableCheckActor = useGroupDetailValue(
    groupUUID,
    'disable_check_actor',
    false
  );
  const isGroupManager = useIsGroupManager(groupUUID);

  return isGroupManager || !disableCheckActor;
}

/**
 * 查看人物卡
 */
function handleShowActorProfile(groupActor: GroupActorType) {
  if (groupActor) {
    openModal(
      <ActorInfo
        data={getGroupActorInfo(groupActor)}
        templateUUID={getGroupActorTemplateUUID(groupActor)}
      />
    );
  } else {
    showToasts('需要groupActor');
  }
}

const NoCard = TMemo(() => {
  const { t } = useTranslation();
  return <div className="no-content">{t('暂无卡片')}</div>;
});
NoCard.displayName = 'NoCard';

/**
 * 我的人物卡
 */
const SelfGroupActorList: React.FC<{
  groupUUID: string;
}> = TMemo((props) => {
  const { groupUUID } = props;
  const selfGroupActors = useSelfGroupActors(groupUUID);
  const { t } = useTranslation();

  if (selfGroupActors.length === 0) {
    return <NoCard />;
  }

  return (
    <ActorCardListContainer>
      {selfGroupActors.map((actor) => {
        return (
          <ActorCard
            key={actor.uuid}
            actor={actor}
            actions={[
              <Tooltip key="query" title={t('查询')}>
                <button onClick={() => handleShowActorProfile(actor)}>
                  <Iconfont>&#xe61b;</Iconfont>
                </button>
              </Tooltip>,
            ]}
          />
        );
      })}
    </ActorCardListContainer>
  );
});

/**
 * 正式人物卡列表
 */
const GroupActorsList: React.FC<{
  groupUUID: string;
}> = TMemo((props) => {
  const { groupUUID } = props;
  const groupInfo = useJoinedGroupInfo(groupUUID)!;
  const groupActors = groupInfo.group_actors;
  const isGroupManager = useIsGroupManager(groupUUID);
  const dispatch = useTRPGDispatch();
  const { t } = useTranslation();

  const handleEditActorInfo = (groupActor: GroupActorType) => {
    const templateUUID = getGroupActorTemplateUUID(groupActor);

    const key = openModal(
      <ActorEdit
        name={groupActor.name}
        avatar={groupActor.avatar}
        desc={groupActor.desc}
        data={getGroupActorInfo(groupActor)}
        templateUUID={templateUUID}
        onSave={(data) => {
          editGroupActor(groupInfo.uuid, groupActor.uuid, data)
            .then(() => {
              dispatch(
                updateGroupActorInfo(groupInfo.uuid, groupActor.uuid, data)
              );
              dispatch(showAlert(t('保存完毕!')));
              closeModal(key);
            })
            .catch((err) => {
              dispatch(showAlert(err));
              console.error(err);
            });
        }}
      />
    );
  };

  const handleRemoveGroupActor = (groupActorUUID: string) => {
    dispatch(
      showAlert({
        content: t('你确定要删除该人物卡么？删除后无法找回'),
        onConfirm: () => {
          dispatch(removeGroupActor(groupUUID, groupActorUUID));
        },
      })
    );
  };

  const passedActors = (groupActors ?? []).filter(
    (item) => item.passed === true
  );

  if (passedActors.length === 0) {
    return <NoCard />;
  }

  return (
    <ActorCardListContainer>
      {passedActors.map((item) => {
        const groupActor = item; // 团人物卡信息
        const originActor = groupActor.actor;
        const groupActorUUID = groupActor.uuid;

        const actions = [
          <Tooltip key="query" title={t('查询')}>
            <button onClick={() => handleShowActorProfile(groupActor)}>
              <Iconfont>&#xe61b;</Iconfont>
            </button>
          </Tooltip>,
        ];

        if (isGroupManager) {
          actions.push(
            <Tooltip key="edit" title={t('编辑')}>
              <button onClick={() => handleEditActorInfo(groupActor)}>
                <Iconfont>&#xe612;</Iconfont>
              </button>
            </Tooltip>,
            <Tooltip key="delete" title={t('删除')}>
              <button onClick={() => handleRemoveGroupActor(groupActorUUID)}>
                <Iconfont>&#xe76b;</Iconfont>
              </button>
            </Tooltip>
          );
        }

        return (
          <ActorCard
            key={groupActor.uuid}
            actor={groupActor}
            actions={actions}
          />
        );
      })}
    </ActorCardListContainer>
  );
});
GroupActorsList.displayName = 'GroupActorsList';

/**
 * 待审核人物卡列表
 */
const GroupActorChecksList: React.FC<{
  groupUUID: string;
}> = TMemo((props) => {
  const { groupUUID } = props;
  const groupInfo = useJoinedGroupInfo(groupUUID)!;
  const groupActors = groupInfo.group_actors;
  const isGroupManager = useIsGroupManager(groupUUID);
  const noPassedActors = (groupActors ?? []).filter(
    (item) => item.passed === false
  );
  const { t } = useTranslation();

  const handleApprove = (groupActorInfo: GroupActorType) => {
    if (_isNil(groupActorInfo)) {
      showToasts(t('需要groupActor'));
      return;
    }

    openModal(
      <GroupActorCheck
        actorData={getGroupActorInfo(groupActorInfo)}
        templateUUID={getGroupActorTemplateUUID(groupActorInfo)}
        groupUUID={groupUUID}
        groupActorUUID={groupActorInfo.uuid}
      />
    );
  };

  if (noPassedActors.length === 0) {
    return <NoCard />;
  }

  return (
    <ActorCardListContainer>
      {noPassedActors.map((item) => {
        const groupActor: GroupActorType = item; // 团人物卡信息

        const actions = [
          <Tooltip key="query" title={t('查询')}>
            <button onClick={() => handleShowActorProfile(groupActor)}>
              <Iconfont>&#xe61b;</Iconfont>
            </button>
          </Tooltip>,
        ];

        if (isGroupManager) {
          actions.push(
            <Tooltip title={t('审批')}>
              <button onClick={() => handleApprove(groupActor)}>
                <Iconfont>&#xe83f;</Iconfont>
              </button>
            </Tooltip>
          );
        }

        return (
          <ActorCard
            key={groupActor.uuid}
            actor={groupActor}
            actions={actions}
          />
        );
      })}
    </ActorCardListContainer>
  );
});
GroupActorChecksList.displayName = 'GroupActorChecksList';

interface GroupActorManageProps {
  groupUUID: string;
}
export const GroupActorManage: React.FC<GroupActorManageProps> = TMemo(
  (props) => {
    const { groupUUID } = props;
    const { t } = useTranslation();
    const groupInfo = useJoinedGroupInfo(groupUUID);
    const dispatch = useTRPGDispatch();
    const groupActorNum = groupInfo?.group_actors?.length ?? 0;
    const allowDisplayActorPanel = useAllowDisplayActorPanel(groupUUID);

    const handleSendGroupActorCheck = useCallback(() => {
      const key = openModal(
        <ActorSelect
          onSelect={(actorUUID) => {
            dispatch(requestAddGroupActor(groupUUID, actorUUID));
            closeModal(key);
          }}
        />
      );
    }, [groupUUID]);

    if (_isNil(groupInfo)) {
      return <Result status="warning" title={t('找不到相关信息')} />;
    }

    return (
      <div>
        <Typography.Title level={3}>{t('人物卡管理')}</Typography.Title>

        <Typography.Title level={4}>
          <span style={{ marginRight: 10 }}>
            {t('共 {{groupActorNum}} 张角色卡', { groupActorNum })}
          </span>
          <Button type="primary" onClick={handleSendGroupActorCheck}>
            {t('提交人物卡')}
          </Button>
        </Typography.Title>

        <div>
          <PillTabs>
            <TabPane key="1" tab={t('我的人物卡')}>
              <SelfGroupActorList groupUUID={groupUUID} />
            </TabPane>
            {allowDisplayActorPanel && (
              <Fragment>
                <TabPane key="2" tab={t('正式人物卡')}>
                  <GroupActorsList groupUUID={groupUUID} />
                </TabPane>
                <TabPane key="3" tab={t('待审核人物卡')}>
                  <GroupActorChecksList groupUUID={groupUUID} />
                </TabPane>
              </Fragment>
            )}
          </PillTabs>
        </div>
      </div>
    );
  }
);
GroupActorManage.displayName = 'GroupActorManage';
