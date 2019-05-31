import React from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import TPopup from './TPopup';
import { TButton } from '../TComponent';

const Container = styled.View`
  background-color: rgba(0, 0, 0, 0.2);
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const AlertView = styled.View`
  min-width: 280px;
  min-height: 180px;
  max-width: 280px;
  max-height: 240px;
  background-color: #f1f1f1;
  border-radius: 10px;
  padding: 10px;
`;

const Header = styled.View`
  border-bottom-width: 0.5px;
  border-bottom-color: #ccc;
  padding: 4px 0 8px 0;
`;

const Title = styled.Text`
  text-align: center;
  font-size: 22px;
`;
const ConfirmBtn = styled(TButton)`
  flex: 1;
  margin: 4px 6px;
`;

const CancelBtn = styled(TButton)`
  flex: 1;
  margin: 4px 6px;
  background-color: white;
`;

const Body = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 14px 0 10px 0;
`;

const Content = styled.Text`
  text-align: center;
  font-size: 16px;
`;

const Footer = styled.View`
  flex-direction: row;
`;

class TAlertContainer extends React.Component {
  render() {
    const { showAlertInfo, onRequestClose } = this.props;
    const title = showAlertInfo.get('title') || '';
    const content = showAlertInfo.get('content') || '确认进行该操作?';
    const confirmTitle = showAlertInfo.get('confirmTitle');
    const onConfirm = showAlertInfo.get('onConfirm');
    const onCancel = showAlertInfo.get('onCancel');

    let header, cancelBtn;
    if (title) {
      header = (
        <Header>
          <Title>{title}</Title>
        </Header>
      );
    }

    if (onConfirm) {
      cancelBtn = (
        <CancelBtn
          textStyle={{ color: '#666' }}
          onPress={() => (onCancel ? onCancel() : onRequestClose())}
        >
          取消
        </CancelBtn>
      );
    }

    return (
      <Modal
        animationType="fade"
        transparent={true}
        onRequestClose={onRequestClose}
      >
        <Container>
          <AlertView>
            {header}
            <Body>
              <Content>{content}</Content>
            </Body>
            <Footer>
              {cancelBtn}
              <ConfirmBtn
                onPress={() => (onConfirm ? onConfirm() : onRequestClose())}
              >
                {confirmTitle || '确认'}
              </ConfirmBtn>
            </Footer>
          </AlertView>
        </Container>
      </Modal>
    );
  }
}

const TAlert = {
  show: function(alertInfo, opts) {
    return TPopup.show(
      <TAlertContainer
        showAlertInfo={alertInfo}
        onRequestClose={() => {
          opts.onRequestClose ? opts.onRequestClose() : this.hide();
        }}
      />
    );
  },
  hide: function() {
    TPopup.hide();
  },
};

export default TAlert;
