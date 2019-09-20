import React from 'react';
import styled from 'styled-components/native';
import TIcon from '../TComponent/TIcon';

const DickBtn = styled.TouchableOpacity<{ isSelected?: boolean }>`
  width: 80px;
  height: 80px;
  border: 0.5px solid;
  border-radius: 3px;
  margin: 10px;
  padding: 10px;
  border-color: ${(props) => (props.isSelected === true ? '#e67e22' : '#ccc')};
`;

const IconText = styled(TIcon)`
  color: #ccc;
  font-size: 32px;
  text-align: center;
  line-height: 48px;
`;

const BtnText = styled.Text`
  text-align: center;
`;

interface Props {
  icon: string;
  text: string;
  isSelected: boolean;
  onPress?: () => void;
}
const QuickDiceBtn = React.memo((props: Props) => {
  return (
    <DickBtn isSelected={props.isSelected} onPress={props.onPress}>
      <IconText icon={props.icon} />
      <BtnText>{props.text}</BtnText>
    </DickBtn>
  );
});

export default QuickDiceBtn;
