import React, { Fragment, useMemo, useCallback } from 'react';
import { Text, TextInput, View } from 'react-native';
import styled from 'styled-components/native';
import { TInput, TIcon } from '../../components/TComponent';
import { Icon, Popover } from '@ant-design/react-native';
import config from '@shared/project.config';
import { MsgType } from '@redux/types/chat';
import { TMemo } from '@shared/components/TMemo';
import _find from 'lodash/find';
import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';

export type UserMsgType = Extract<
  MsgType,
  'normal' | 'ooc' | 'speak' | 'action'
>;

const msgMaxLength = config.chat.maxLength;

const InputViewContainer = styled.View`
  padding: 6px 12px;
  background-color: white;
  flex-direction: row;
`;

const ChatInput = styled(TInput)`
  height: 35px;
  padding: 4px 6px;
  flex: 1;
  margin-right: 4px;
`;

const MsgTypeBtn = styled.Text`
  font-size: 20px;
  margin-right: 4px;
  line-height: 35px;
`;

const ActionBtn = styled.TouchableOpacity`
  align-self: stretch;
  justify-content: center;
  margin: 0px 3px;
`;

interface Props {
  inputRef?: React.RefObject<TextInput>;
  value: string;
  msgType: UserMsgType;
  onChange: (val: string) => void;
  onSendMsg: () => void;
  onFocus: () => void;
  onShowEmoticonPanel: () => void;
  onShowExtraPanel: () => void;
  onChangeMsgType: (type: UserMsgType) => void;
}

export const msgTypeList = [
  { name: 'normal', label: '普通信息', icon: <TIcon icon="&#xe72d;" /> },
  { name: 'ooc', label: '吐槽信息', icon: <TIcon icon="&#xe64d;" /> },
  { name: 'speak', label: '对话信息', icon: <TIcon icon="&#xe61f;" /> },
  { name: 'action', label: '动作信息', icon: <TIcon icon="&#xe619;" /> },
];

const InputView: React.FC<Props> = TMemo((props) => {
  const {
    inputRef,
    value,
    msgType,
    onChange,
    onSendMsg,
    onFocus,
    onShowEmoticonPanel,
    onShowExtraPanel,
    onChangeMsgType,
  } = props;

  const overlay = useMemo(
    () =>
      msgTypeList.map((msgType) => (
        <Popover.Item key={msgType.name} value={msgType.name}>
          <Text>
            {msgType.icon}
            <Text>{msgType.label}</Text>
          </Text>
        </Popover.Item>
      )),
    []
  );

  const msgTypeBtn = useMemo(() => {
    const item = _find(msgTypeList, ['name', msgType]);

    if (_isNil(item)) {
      return (
        <MsgTypeBtn>
          <TIcon icon="&#xe72d;" />
        </MsgTypeBtn>
      );
    } else {
      return <MsgTypeBtn>{item.icon}</MsgTypeBtn>;
    }
  }, [msgType]);

  const handleSelectMsgType = useCallback(
    (value, index) => {
      _isFunction(onChangeMsgType) && onChangeMsgType(value);
    },
    [onChangeMsgType]
  );

  return (
    <InputViewContainer>
      <Popover overlay={overlay} onSelect={handleSelectMsgType}>
        {msgTypeBtn}
      </Popover>
      <ChatInput
        ref={inputRef}
        onChangeText={onChange}
        onFocus={onFocus}
        multiline={true}
        maxLength={msgMaxLength}
        textAlignVertical="center"
        value={value}
      />
      <ActionBtn onPress={onShowEmoticonPanel}>
        <Icon name="smile" size={26} />
      </ActionBtn>
      {value ? (
        <ActionBtn onPress={onSendMsg}>
          <Text style={{ textAlign: 'center' }}>{'发送'}</Text>
        </ActionBtn>
      ) : (
        <ActionBtn onPress={onShowExtraPanel}>
          <Icon name="plus-circle" size={26} />
        </ActionBtn>
      )}
    </InputViewContainer>
  );
});
InputView.displayName = 'InputView';

export default InputView;
