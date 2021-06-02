import React from 'react';
import type { RenderMsgPayload } from '@redux/types/chat';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import PopoverUserInfo from './UserInfo';
import { TMemo } from '@shared/components/TMemo';
import { msgSenderPopoverList } from '@web/reg/regMsgSenderPopover';

/**
 * 专门用于处理消息信息中点击头像的Popover
 */

interface Props {
  payload: RenderMsgPayload;
}
const PopoverMsgSenderInfo: React.FC<Props> = TMemo((props) => {
  const findedPopover = msgSenderPopoverList.find((item) =>
    item.match(props.payload)
  );
  if (findedPopover) {
    // 找到匹配的popover
    return findedPopover.render(props.payload);
  }

  // 显示用户信息
  const senderUUID = props.payload.sender_uuid;
  return <PopoverUserInfo userUUID={senderUUID} />;
});
PopoverMsgSenderInfo.displayName = 'PopoverMsgSenderInfo';

export default PopoverMsgSenderInfo;
