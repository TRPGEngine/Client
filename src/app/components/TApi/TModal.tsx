import React from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';
import sb from 'react-native-style-block';
import TPopup from './TPopup';

const styles = {
  container: [sb.flex(), sb.center()],
  mask: [sb.position('absolute', 0, 0, 0, 0), sb.bgColor('rgba(0, 0, 0, 0.2)')],
  view: [
    sb.padding(10),
    sb.bgColor(),
    sb.radius(3),
    { minWidth: 240, minHeight: 320 },
  ],
};

interface Props {
  onRequestClose: () => void;
}
class TModalContainer extends React.Component<Props> {
  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        onRequestClose={this.props.onRequestClose}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={this.props.onRequestClose}>
            <View style={styles.mask} />
          </TouchableWithoutFeedback>

          <View style={styles.view}>{this.props.children}</View>
        </View>
      </Modal>
    );
  }
}

const TModal = {
  show: function(view) {
    return TPopup.show(
      <TModalContainer onRequestClose={() => this.hide()}>
        {view}
      </TModalContainer>
    );
  },
  hide: function() {
    TPopup.hide();
  },
};

export default TModal;
