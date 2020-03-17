import React from 'react';
import { View, Text } from 'react-native';
import { MsgPayload } from '@redux/types/chat';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import PopoverUserInfo from './UserInfo';
// import PopoverGroupActorInfo from './GroupActorInfo';
import { TMemo } from '@shared/components/TMemo';

/**
 * 专门用于处理消息信息的Popover
 */

interface Props {
  payload: MsgPayload;
}
const PopoverMsgSenderInfo: React.FC<Props> = TMemo((props) => {
  const groupActorUUID = _get(props.payload, ['data', 'groupActorUUID']);
  const isGroupActorMessage = !_isNil(groupActorUUID);

  if (isGroupActorMessage) {
    // return <PopoverGroupActorInfo groupActorUUID={groupActorUUID} />;
    return (
      <View>
        <Text>未实现</Text>
      </View>
    );
  } else {
    const senderUUID = props.payload.sender_uuid;
    return <PopoverUserInfo userUUID={senderUUID} />;
  }
});
PopoverMsgSenderInfo.displayName = 'PopoverMsgSenderInfo';

export default PopoverMsgSenderInfo;
