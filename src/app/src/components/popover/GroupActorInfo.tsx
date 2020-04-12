import React, { useContext, useMemo } from 'react';
import { Text } from 'react-native';
import { GroupInfoContext } from '@shared/context/GroupInfoContext';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import { GroupActorType } from '@redux/types/group';
import { TMemo } from '@shared/components/TMemo';
import { TAvatar } from '../TComponent';
import { useCurrentGroupInfo } from '@shared/redux/hooks/useCurrentGroupInfo';
import {
  Container,
  AvatarContainer,
  AttrContainer,
  AttrRow,
} from './__shared__';

interface Props {
  groupActorUUID: string;
}
const PopoverGroupActorInfo: React.FC<Props> = TMemo((props) => {
  const groupInfo = useCurrentGroupInfo();

  const groupActorInfo: GroupActorType = useMemo(() => {
    const groupActors = _get(groupInfo, ['group_actors'], []);
    return _find(groupActors, ['uuid', props.groupActorUUID]) || {};
  }, [groupInfo, props.groupActorUUID]);

  return useMemo(() => {
    return _isEmpty(groupActorInfo) ? (
      <Text>人物卡不存在, 可能已经被删除</Text>
    ) : (
      <Container>
        <AvatarContainer>
          <TAvatar
            uri={groupActorInfo.avatar}
            name={groupActorInfo.name}
            height={40}
            width={40}
          />
        </AvatarContainer>
        <AttrContainer>
          <AttrRow>
            <Text>名称: </Text>
            <Text>{groupActorInfo.name}</Text>
          </AttrRow>
          <AttrRow>
            <Text>描述: </Text>
            <Text>{groupActorInfo.desc}</Text>
          </AttrRow>
        </AttrContainer>
      </Container>
    );
  }, [groupActorInfo]);
});
PopoverGroupActorInfo.displayName = 'PopoverGroupActorInfo';

export default PopoverGroupActorInfo;
