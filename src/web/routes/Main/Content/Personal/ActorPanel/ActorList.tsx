import React, { Fragment } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import { ActorCard, ActorCardListContainer } from '@web/components/ActorCard';
import { removeActor, unshareActor, shareActor } from '@redux/actions/actor';
import { showAlert, showModal } from '@redux/actions/ui';
import _isNil from 'lodash/isNil';
import ActorEdit from '@web/components/modal/ActorEdit';
import { updateActor } from '@web/redux/action/actor';
import { showToasts } from '@shared/manager/ui';
import ActorInfo from '@web/components/modal/ActorInfo';
import { Typography } from 'antd';
import { t } from '@shared/i18n';

export const ActorList: React.FC = TMemo(() => {
  const selfActors = useTRPGSelector((state) => state.actor.selfActors);
  const dispatch = useTRPGDispatch();

  const handleRemoveActor = (uuid: string) => {
    dispatch(
      showAlert({
        content:
          '你确定要删除该人物卡么？删除后会同时删除相关的团人物并无法找回',
        onConfirm: () => dispatch(removeActor(uuid)),
      })
    );
  };

  const handleOpenActorEditModal = (uuid: string) => {
    const actor = selfActors.find((a) => a.uuid === uuid);
    if (_isNil(actor)) {
      showToasts(t('角色不存在'), 'error');
      return;
    }

    const name = actor.name;
    const desc = actor.desc;
    const avatar = actor.avatar;
    const templateUUID = actor.template_uuid;

    dispatch(
      showModal(
        <ActorEdit
          name={name}
          desc={desc}
          avatar={avatar}
          data={actor.info}
          templateUUID={templateUUID}
          onSave={(data) => {
            dispatch(
              updateActor(uuid, data._name, data._avatar, data._desc, data)
            );
          }}
        />
      )
    );
  };

  const handleOpenActorInfoModal = (uuid: string) => {
    const actor = selfActors.find((a) => a.uuid === uuid);
    if (_isNil(actor)) {
      showToasts(t('角色不存在'), 'error');
      return;
    }

    dispatch(
      showModal(
        <ActorInfo
          name={actor.name}
          desc={actor.desc}
          avatar={actor.avatar}
          data={actor.info}
          templateUUID={actor.template_uuid}
        />
      )
    );
  };

  const handleShareActor = (uuid: string) => {
    dispatch(
      showAlert({
        title: '是否要分享人物卡?',
        content: '分享后人物卡会被其他人看到并允许被fork',
        onConfirm: () => {
          dispatch(shareActor(uuid));
        },
      })
    );
  };

  const handleUnshareActor = (uuid: string) => {
    dispatch(
      showAlert({
        title: '取消分享人物卡',
        content: '取消后无法被其他人搜到',
        onConfirm: () => {
          dispatch(unshareActor(uuid));
        },
      })
    );
  };

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 10 }}>
        共 {selfActors.length} 张角色卡
      </Typography.Title>

      <ActorCardListContainer>
        {selfActors.map((item, index) => {
          const uuid = item.uuid;

          return (
            <ActorCard
              key={`${uuid}-${index}`}
              actor={item}
              actions={
                <Fragment>
                  <button onClick={() => handleRemoveActor(uuid)}>
                    {t('删除')}
                  </button>
                  <button onClick={() => handleOpenActorEditModal(uuid)}>
                    {t('编辑')}
                  </button>
                  <button onClick={() => handleOpenActorInfoModal(uuid)}>
                    {t('查看')}
                  </button>
                  {item.shared ? (
                    <button onClick={() => handleUnshareActor(uuid)}>
                      {t('分享中')}
                    </button>
                  ) : (
                    <button onClick={() => handleShareActor(uuid)}>
                      {t('分享')}
                    </button>
                  )}
                </Fragment>
              }
            />
          );
        })}
      </ActorCardListContainer>
    </div>
  );
});
ActorList.displayName = 'ActorList';
