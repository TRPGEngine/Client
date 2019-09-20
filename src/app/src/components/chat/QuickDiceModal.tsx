import React, { Fragment } from 'react';
import { View, Text } from 'react-native';
import { Modal, WingBlank } from '@ant-design/react-native';
import QuickDiceBtn from './QuickDiceBtn';
import styled from 'styled-components/native';
import { TButton } from '../TComponent';

const Container = styled.View`
  height: 220px;
  width: 100%;
  margin: auto;
  background-color: white;
`;

const DiceTypeContainer = styled.ScrollView.attrs((props) => ({
  horizontal: true,
}))`
  width: 100%;
  flex: 0;
  flex-basis: 100px;
`;

const DiceText = styled.Text`
  flex: 1;
  line-height: 32px;
  font-size: 26px;
  text-align: center;
`;

interface Props {
  visible: boolean;
  onClose?: () => void;
}
export default class QuickDiceModal extends React.Component<Props> {
  state = {
    diceExp: '',
  };

  setDice(diceExp: string) {
    this.setState({ diceExp });
  }

  getDefaultDiceBtn() {
    const { diceExp } = this.state;

    return (
      <Fragment>
        <QuickDiceBtn
          isSelected={'1d20' === diceExp}
          icon="&#xe6fd;"
          text={'1D20'}
          onPress={() => this.setDice('1d20')}
        />
        <QuickDiceBtn
          isSelected={'1d8' === diceExp}
          icon="&#xe6fb;"
          text={'1D8'}
          onPress={() => this.setDice('1d8')}
        />
        <QuickDiceBtn
          isSelected={'1d6' === diceExp}
          icon="&#xe6fc;"
          text={'1D6'}
          onPress={() => this.setDice('1d6')}
        />
        <QuickDiceBtn
          isSelected={'1d4' === diceExp}
          icon="&#xe6fa;"
          text={'1D4'}
          onPress={() => this.setDice('1d4')}
        />
      </Fragment>
    );
  }

  render() {
    const { diceExp } = this.state;

    return (
      <Modal
        transparent={false}
        visible={this.props.visible}
        animationType="slide-up"
        popup={true}
        onClose={this.props.onClose}
        maskClosable={true}
      >
        <Container>
          <WingBlank style={{ flex: 1 }}>
            <DiceTypeContainer>{this.getDefaultDiceBtn()}</DiceTypeContainer>
            <DiceText>{diceExp}</DiceText>
            <TButton>发送</TButton>
          </WingBlank>
        </Container>
      </Modal>
    );
  }
}
