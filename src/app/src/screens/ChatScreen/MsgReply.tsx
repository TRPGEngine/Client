import React, { useCallback, useMemo } from 'react';
import { Text } from 'react-native';
import { TMemo } from '@shared/components/TMemo';
import { useMsgContainerContext } from '@shared/context/MsgContainerContext';
import { useUserName } from '@redux/hooks/user';
import _isNil from 'lodash/isNil';
import styled from 'styled-components/native';
import { IconOutline } from '@ant-design/icons-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Container = styled.View`
  position: relative;
`;
const Inner = styled.View`
  position: absolute;
  width: 100%;
  background: white;
  padding: 8px 16px;
  bottom: 0;
  display: flex;
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.color['bon-jour']};
`;

const ReplyInfo = styled.View`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
`;

const CloseBtnIcon = styled(IconOutline).attrs({
  name: 'close-circle',
})`
  color: ${(props) => props.theme.color['mine-shaft']};
  font-size: 22px;
`;

export const MsgReply: React.FC = TMemo(() => {
  const { replyMsg, clearReplyMsg } = useMsgContainerContext();
  const replyMsgSenderName = useUserName(replyMsg?.sender_uuid);

  const handleClose = useCallback(() => {
    clearReplyMsg();
  }, [clearReplyMsg]);
  const closeBtn = useMemo(() => {
    return (
      <TouchableOpacity onPress={handleClose}>
        <CloseBtnIcon />
      </TouchableOpacity>
    );
  }, [handleClose]);

  return (
    !_isNil(replyMsg) && (
      <Container>
        <Inner>
          <ReplyInfo>
            <Text>回复 {replyMsgSenderName}:</Text>
            <Text numberOfLines={2}>{replyMsg.message}</Text>
          </ReplyInfo>
          {closeBtn}
        </Inner>
      </Container>
    )
  );
});
MsgReply.displayName = 'MsgReply';
