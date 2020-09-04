import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { getMsgDate } from '@shared/utils/date-helper';

interface MsgProfileProps {
  name: string;
  date: string;
}
export const MsgProfile: React.FC<MsgProfileProps> = TMemo((props) => {
  const { name, date } = props;

  return (
    <div className="profile">
      <span className="name">{name}</span>
      <span className="time">{getMsgDate(date)}</span>
    </div>
  );
});
MsgProfile.displayName = 'MsgProfile';
