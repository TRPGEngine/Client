import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ReplyMsgType } from '@shared/utils/msg-helper';
import styled from 'styled-components/native';
import { useUserName } from '@redux/hooks/useUser';

const Container = styled.View`
  border-left-width: 3px;
  border-left-color: ${(props) => props.theme.color['dusty-gray']};
  padding: 2px 4px;
  margin: 3px 0;
`;

const MsgText = styled.Text`
  color: ${(props) => props.theme.color['dove-gray']};
  font-size: 10px;
`;

interface Props {
  replyMsg: ReplyMsgType;
}
export const MsgQuote: React.FC<Props> = TMemo((props) => {
  const { replyMsg } = props;
  const { uuid, message, sender_uuid } = replyMsg;
  const senderUserName = useUserName(sender_uuid);

  return (
    <Container>
      <MsgText>{senderUserName}:</MsgText>
      <MsgText>{message}</MsgText>
    </Container>
  );
});
MsgQuote.displayName = 'MsgQuote';
