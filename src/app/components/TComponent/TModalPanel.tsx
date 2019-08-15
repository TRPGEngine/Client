import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Button } from '@ant-design/react-native';

const Container = styled.View``;

const PanelAction = styled.View`
  margin-top: 20px;
  display: flex;
  flex-direction: row-reverse;
`;

const PanelActionButton = styled(Button).attrs(() => ({
  type: 'ghost',
  size: 'small',
}))`
  border: 0;
`;

interface Props {
  onOk?: () => void;
}

export default class TModalPanel extends React.Component<Props> {
  render() {
    const { children, onOk } = this.props;

    return (
      <Container>
        <View>{children}</View>
        <PanelAction>
          <PanelActionButton onPress={() => onOk && onOk()}>
            确认
          </PanelActionButton>
        </PanelAction>
      </Container>
    );
  }
}
