import React from 'react';
import { View, Text, TextInputProps, StyleProp } from 'react-native';
import sb from 'react-native-style-block';
import TInput from './TInput';
import styled from 'styled-components/native';

const FormContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom: 0.5px solid #ccc;
  margin-bottom: 10px;
  height: 44px;
`;

const FormLabel = styled.Text`
  margin-right: 10px;
  flex: 1;
  text-align: right;
  font-size: 16px;
  min-width: 80px;
  height: 32px;
  line-height: 32px;
`;

const FormInput = styled(TInput)`
  flex: 3;
  border: 0;
  background-color: transparent;
  font-size: 16px;
`;

interface Props {
  label: string;
  value: string;
  style: StyleProp<View>;
  input: TextInputProps;
  onChangeText: (text: string) => void;
}
class TFormGroup extends React.Component<Props> {
  static defaultProps = {
    label: '',
    value: '',
    onChangeText: () => {},
    style: [],
    input: [],
  };

  render() {
    if (this.props.input && !this.props.input.style) {
      this.props.input.style = [];
    }
    return (
      <FormContainer {...(this.props as any)}>
        <FormLabel>{this.props.label}:</FormLabel>
        <FormInput
          value={this.props.value}
          onChangeText={(text: string) => this.props.onChangeText(text)}
          {...this.props.input}
        />
      </FormContainer>
    );
  }
}

export default TFormGroup;
