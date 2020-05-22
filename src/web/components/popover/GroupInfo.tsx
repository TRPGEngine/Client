import React, { useMemo } from 'react';
import { useCachedGroupInfo } from '@shared/hooks/useCache';
import styled from 'styled-components';
import Avatar from '../Avatar';
import config from '@shared/project.config';
import _isEmpty from 'lodash/isEmpty';

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
  groupUUID: string;
}
const PopoverGroupInfo: React.FC<Props> = React.memo((props) => {
  const groupInfo = useCachedGroupInfo(props.groupUUID);

  const avatar = useMemo(
    () =>
      _isEmpty(groupInfo.avatar)
        ? config.defaultImg.getGroup(groupInfo.name)
        : groupInfo.avatar,
    [groupInfo.avatar]
  );

  return (
    <Container>
      <div className="avatar">
        <Avatar size="large" src={avatar} name={groupInfo.name} />
      </div>
      <div className="info">
        <div>
          <span>团名称: </span>
          <span>{groupInfo.name}</span>
        </div>
        <div>
          <span>团副名: </span>
          <span>{groupInfo.sub_name}</span>
        </div>
        <div>
          <span>团简介: </span>
          <p>{groupInfo.desc}</p>
        </div>
      </div>
    </Container>
  );
});
PopoverGroupInfo.displayName = 'PopoverGroupInfo';

export default PopoverGroupInfo;
