import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { getMsgDate } from '@shared/utils/date-helper';
import { useMessageItemConfigContext } from '@shared/components/message/MessageItemConfigContext';
import classNames from 'classnames';

interface MsgProfileProps {
  name: string;
  date: string;
}
export const MsgProfile: React.FC<MsgProfileProps> = TMemo((props) => {
  const { name, date } = props;
  const { showAvatar, showInlineTime } = useMessageItemConfigContext();

  return (
    <div
      className={classNames(['profile', { nopadding: showAvatar === false }])}
    >
      <span className="name">{name}</span>

      {showInlineTime !== false ? (
        <span className="time">{getMsgDate(date)}</span>
      ) : null}
    </div>
  );
});
MsgProfile.displayName = 'MsgProfile';
