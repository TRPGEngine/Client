import React, { useContext, useMemo, Fragment, useCallback } from 'react';
import { GroupInfoContext } from '@shared/context/GroupInfoContext';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import { GroupActorType } from '@redux/types/group';
import styled from 'styled-components';
import Avatar from '../Avatar';
import { TMemo } from '@shared/components/TMemo';
import { Button, Divider } from 'antd';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { showModal } from '@redux/actions/ui';
import ActorInfo from '../modals/ActorInfo';
import { useTPopoverContext } from './index';
import { useTranslation } from '@shared/i18n';

/**
 * NOTICE: 不同于别的Popover 团角色的popover不应该从缓存中获取而是应该直接获取团信息
 */

const Container = styled.div`
  display: flex;
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

interface Props {
  groupActorUUID: string;
}
const PopoverGroupActorInfo: React.FC<Props> = TMemo((props) => {
  const { closePopover } = useTPopoverContext();
  const groupInfo = useContext(GroupInfoContext);
  const dispatch = useTRPGDispatch();
  const { t } = useTranslation();

  const groupActorInfo: GroupActorType = useMemo(() => {
    const groupActors = _get(groupInfo, ['group_actors'], []);
    return (
      _find(groupActors, ['uuid', props.groupActorUUID]) ||
      ({} as GroupActorType)
    );
  }, [groupInfo, props.groupActorUUID]);

  const handleShowActorInfo = useCallback(() => {
    closePopover();
    dispatch(
      showModal(
        <ActorInfo
          templateUUID={groupActorInfo.actor_template_uuid!}
          data={groupActorInfo.actor_info!}
        />
      )
    );
  }, [dispatch, groupActorInfo, closePopover]);

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
            <p>{groupActorInfo.desc}</p>
          </div>
        </div>
      </Container>

      <Divider />

      <div style={{ textAlign: 'right' }}>
        <Button size="small" onClick={handleShowActorInfo}>
          {t('查看完整人物卡')}
        </Button>
      </div>
    </Fragment>
  );
});
PopoverGroupActorInfo.displayName = 'PopoverGroupActorInfo';

export default PopoverGroupActorInfo;
