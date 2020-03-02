import React from 'react';
import { Text, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { TInput } from '../../components/TComponent';
import { Icon } from '@ant-design/react-native';
import config from '@shared/project.config';

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

const ActionBtn = styled.TouchableOpacity`
  align-self: stretch;
  justify-content: center;
  margin: 0px 3px;
`;

interface Props {
  inputRef?: React.RefObject<TextInput>;
  value: string;
  onChange: (val: string) => void;
  onSendMsg: () => void;
  onFocus: () => void;
  onShowEmoticonPanel: () => void;
  onShowExtraPanel: () => void;
}
class InputView extends React.PureComponent<Props> {
  render() {
    const {
      inputRef,
      value,
      onChange,
      onSendMsg,
      onFocus,
      onShowEmoticonPanel,
      onShowExtraPanel,
    } = this.props;

    return (
      <InputViewContainer>
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
  }
}

export default InputView;
