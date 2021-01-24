import React from 'react';
import type { RenderMsgPayload } from '@redux/types/chat';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import PopoverUserInfo from './UserInfo';
import PopoverGroupActorInfo from './GroupActorInfo';
import { TMemo } from '@shared/components/TMemo';

/**
 * 专门用于处理消息信息中点击头像的Popover
 */

interface Props {
  payload: RenderMsgPayload;
}
const PopoverMsgSenderInfo: React.FC<Props> = TMemo((props) => {
  const groupActorUUID = _get(props.payload, ['data', 'groupActorUUID']);
  const isGroupActorMessage = !_isNil(groupActorUUID);

  if (isGroupActorMessage) {
    // 显示团角色人物卡信息
    return <PopoverGroupActorInfo groupActorUUID={groupActorUUID} />;
  } else {
    // 显示用户信息
    const senderUUID = props.payload.sender_uuid;
    return <PopoverUserInfo userUUID={senderUUID} />;
  }
});
PopoverMsgSenderInfo.displayName = 'PopoverMsgSenderInfo';

export default PopoverMsgSenderInfo;
