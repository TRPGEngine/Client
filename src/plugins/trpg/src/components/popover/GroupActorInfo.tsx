import React, { useContext, useMemo, Fragment, useCallback } from 'react';
import { GroupInfoContext } from '@capital/shared/context/GroupInfoContext';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import type { GroupActorType } from '@capital/shared/redux/types/group';
import styled from 'styled-components';
import Avatar from '@capital/web/components/Avatar';
import { TMemo } from '@capital/shared/components/TMemo';
import { Button, Divider } from 'antd';
import ActorInfo from '../modals/ActorInfo';
import { useTPopoverContext } from '@capital/web/components/popover/index';
import { useTranslation } from '@capital/shared/i18n';
import {
  useGroupDetailValue,
  useIsGroupManager,
} from '@capital/shared/redux/hooks/group';
import { closeModal, openModal } from '@capital/web/components/Modal';
import { GroupActorEditModal } from '../modals/ActorEdit';
import type { AddonMoreItem } from '@capital/web/components/AddonMore';
import {
  getGroupActorInfo,
  getGroupActorTemplateUUID,
} from '@capital/shared/utils/data-helper';

/**
 * NOTICE: 不同于别的 Popover 团角色的popover不应该从缓存中获取而是应该直接获取团信息
 */

const Container = styled.div`
  display: flex;
  min-width: 180px;
  max-width: 240px;

  .avatar {
    overflow: hidden;
    /* border: 1px solid white; */

    > img {
      width: 100%;
      height: 100%;
    }
  }

  .info {
    flex: 1;
    margin-left: 10px;
    overflow: hidden;
  }
`;

const ActorDescContainer = styled.p`
  max-height: 160px;
  overflow-y: auto;
  overflow-x: hidden;
`;

/**
 * 是否允许显示聊天会话中的查看完整人物卡按钮
 * 如果是管理员则全部显示
 * 如果不是管理员。则仅未打开 disable_check_actor_in_chat 时显示
 * @param groupUUID 团UUID
 */
function useAllowDisplayActorBtn(groupUUID: string): boolean {
  const disableCheckActor = useGroupDetailValue(
    groupUUID,
    'disable_check_actor_in_chat',
    false
  );
  const isGroupManager = useIsGroupManager(groupUUID);

  console.log(isGroupManager, !disableCheckActor, groupUUID);

  return isGroupManager || !disableCheckActor;
}

interface Props {
  groupActorUUID: string;
}
const PopoverGroupActorInfo: React.FC<Props> = TMemo((props) => {
  const { closePopover } = useTPopoverContext();
  const groupInfo = useContext(GroupInfoContext);
  const { t } = useTranslation();
  const allowDisplayActorBtn = useAllowDisplayActorBtn(groupInfo?.uuid ?? '');
  const isGroupManager = useIsGroupManager(groupInfo?.uuid ?? '');

  const groupActorInfo: GroupActorType = useMemo(() => {
    const groupActors = _get(groupInfo, ['group_actors'], []);
    return (
      _find(groupActors, ['uuid', props.groupActorUUID]) ||
      ({} as GroupActorType)
    );
  }, [groupInfo, props.groupActorUUID]);

  const handleShowActorInfo = useCallback(() => {
    closePopover();

    const addonItems: AddonMoreItem[] = [];
    if (isGroupManager === true) {
      addonItems.push({
        label: t('更新人物卡'),
        onClick: () => {
          closeModal();
          const groupActorEditModalkey = openModal(
            <GroupActorEditModal
              name={groupActorInfo.name}
              avatar={groupActorInfo.avatar}
              desc={groupActorInfo.desc}
              data={getGroupActorInfo(groupActorInfo)}
              templateUUID={getGroupActorTemplateUUID(groupActorInfo)}
              groupUUID={groupInfo?.uuid!}
              groupActorUUID={groupActorInfo.uuid}
              onSave={() => {
                closeModal(groupActorEditModalkey);
              }}
            />,
            {
              closable: true,
            }
          );
        },
      });
    }

    openModal(
      <ActorInfo
        templateUUID={groupActorInfo.actor_template_uuid!}
        data={groupActorInfo.actor_info!}
        addonItems={addonItems}
      />,
      {
        closable: true,
      }
    );
  }, [groupInfo, groupActorInfo, closePopover, isGroupManager]);

  return _isEmpty(groupActorInfo) ? (
    <div>{t('人物卡不存在, 可能已经被删除')}</div>
  ) : (
    <Fragment>
      <Container>
        <div className="avatar">
          <Avatar
            size="large"
            src={groupActorInfo.avatar}
            name={groupActorInfo.name}
          />
        </div>
        <div className="info">
          <div>
            <span>{t('名称')}: </span>
            <span>{groupActorInfo.name}</span>
          </div>
          <div>
            <span>{t('描述')}: </span>
            <ActorDescContainer>{groupActorInfo.desc}</ActorDescContainer>
          </div>
        </div>
      </Container>

      {allowDisplayActorBtn && (
        <Fragment>
          <Divider />

          <div style={{ textAlign: 'right' }}>
            <Button size="small" onClick={handleShowActorInfo}>
              {t('查看完整人物卡')}
            </Button>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
});
PopoverGroupActorInfo.displayName = 'PopoverGroupActorInfo';

export default PopoverGroupActorInfo;
