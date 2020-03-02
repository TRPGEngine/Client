import React, { useContext, useMemo } from 'react';
import { GroupInfoContext } from '@shared/context/GroupInfoContext';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import _find from 'lodash/find';
import { GroupActorType } from '@redux/types/group';
import styled from 'styled-components';
import Avatar from '../Avatar';

/**
 * NOTICE: 不同于别的Popover 团角色的popover不应该从缓存中获取而是应该直接获取团信息
 */

const Container = styled.div`
  display: flex;
  max-width: 240px;

  .avatar {
    overflow: hidden;
    border: 1px solid white;

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
const PopoverGroupActorInfo: React.FC<Props> = React.memo((props) => {
  const groupInfo = useContext(GroupInfoContext);

  const groupActorInfo: GroupActorType = useMemo(() => {
    const groupActors = _get(groupInfo, ['group_actors'], []);
    return _find(groupActors, ['uuid', props.groupActorUUID]) || {};
  }, [groupInfo, props.groupActorUUID]);

  return (
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
          <span>名称: </span>
          <span>{groupActorInfo.name}</span>
        </div>
        <div>
          <span>描述: </span>
          <p>{groupActorInfo.desc}</p>
        </div>
      </div>
      {/* TODO: 增加显示完整人物卡的按钮 */}
    </Container>
  );
});
PopoverGroupActorInfo.displayName = 'PopoverGroupActorInfo';

export default PopoverGroupActorInfo;
