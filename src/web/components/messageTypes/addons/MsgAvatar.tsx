import React, { useMemo } from 'react';
import { MessageProps } from '@shared/components/message/MessageHandler';
import { TMemo } from '@shared/components/TMemo';
import { isUserOrGroupUUID } from '@shared/utils/uuid';
import _get from 'lodash/get';
import { useMessageItemConfigContext } from '@shared/components/message/MessageItemConfigContext';
import { TPopover } from '@web/components/popover';
import PopoverMsgSenderInfo from '@web/components/popover/MsgSenderInfo';
import Avatar from '@web/components/Avatar';

export const MsgAvatar: React.FC<{
  me: boolean;
  name: string;
  src: string;
  info: MessageProps['info'];
}> = TMemo((props) => {
  const senderIsUser = useMemo(() => {
    return isUserOrGroupUUID(_get(props.info, ['sender_uuid']));
  }, [props.info]);
  const { popover } = useMessageItemConfigContext();

  return senderIsUser && popover ? (
    <TPopover
      placement={props.me ? 'left' : 'right'}
      trigger="click"
      content={<PopoverMsgSenderInfo payload={props.info} />}
    >
      <div>
        <Avatar name={props.name} src={props.src} size={38} />
      </div>
    </TPopover>
  ) : (
    <Avatar name={props.name} src={props.src} size={38} />
  );
});
MsgAvatar.displayName = 'MsgAvatar';
