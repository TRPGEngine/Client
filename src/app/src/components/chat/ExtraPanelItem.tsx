import React from 'react';
import { TIcon } from '../TComponent';
import styled from 'styled-components/native';

interface Props {
  icon: string;
  text: string;
  onPress: () => void;
}

const Container = styled.TouchableOpacity`
  margin: 10px;
  width: 80px;
`;

const IconContainer = styled.View`
  width: 60px;
  height: 60px;
  border: 0.5px solid #ccc;
  border-radius: 3px;
  margin: 10px;
`;

const IconText = styled(TIcon)`
  color: #ccc;
  font-size: 32px;
  text-align: center;
  line-height: 60px;
`;

const ItemText = styled.Text`
  color: #666;
  text-align: center;
  font-size: 12px;
`;

class ExtraPanelItem extends React.Component<Props> {
  render() {
    const { icon, text, onPress } = this.props;

    return (
      <Container onPress={onPress}>
        <IconContainer>
          <IconText icon={icon} />
        </IconContainer>
        <ItemText>{text}</ItemText>
      </Container>
    );
  }
}

export default ExtraPanelItem;
