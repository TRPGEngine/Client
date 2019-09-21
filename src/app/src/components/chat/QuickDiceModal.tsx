import React, { Fragment } from 'react';
import { View, Text } from 'react-native';
import { Modal, WingBlank, PickerView } from '@ant-design/react-native';
import QuickDiceBtn from './QuickDiceBtn';
import styled from 'styled-components/native';
import { TButton } from '../TComponent';
import _range from 'lodash/range';
import { PickerData } from '@ant-design/react-native/es/picker/PropsType';

const MainContainer = styled.View`
  height: 220px;
  width: 100%;
  margin: auto;
  background-color: white;
`;

const DiceTypeContainer = styled.ScrollView.attrs((props) => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
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

const CustomDiceContainer = styled.View`
  padding: 10px 0;
`;

const customDices: PickerData[][] = [
  _range(10)
    .map((v) => v + 1)
    .map<PickerData>((v) => ({
      label: String(v),
      value: v,
    })),
  _range(100)
    .map((v) => v + 1)
    .map<PickerData>((v) => ({
      label: `d${v}`,
      value: v,
    })),
];

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

  renderCustomDiceView() {
    const value = this.state.diceExp.split('d').map(Number);

    return (
      <CustomDiceContainer>
        <PickerView
          value={value}
          onChange={(val) => this.setState({ diceExp: val.join('d') })}
          data={customDices}
          cascade={false}
        />
      </CustomDiceContainer>
    );
  }

  renderDefaultDiceBtn() {
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
        {this.renderCustomDiceView()}
        <MainContainer>
          <WingBlank style={{ flex: 1 }}>
            <DiceTypeContainer>{this.renderDefaultDiceBtn()}</DiceTypeContainer>
            <DiceText>{diceExp}</DiceText>
            <TButton>发送</TButton>
          </WingBlank>
        </MainContainer>
      </Modal>
    );
  }
}
