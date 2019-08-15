import React from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';
import sb from 'react-native-style-block';
import TPopup from './TPopup';
import _get from 'lodash/get';

const styles = {
  container: [sb.flex(), sb.center()],
  mask: [sb.position('absolute', 0, 0, 0, 0), sb.bgColor('rgba(0, 0, 0, 0.2)')],
  view: [
    sb.padding(10),
    sb.bgColor(),
    sb.radius(3),
    { minWidth: 240, minHeight: 120 },
  ],
};

interface Props {
  onRequestClose: () => void;
}
class TModalContainer extends React.Component<Props> {
  render() {
    return (
      <Modal
        animationType="slide"
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

export interface TModalOptions {
  onRequestClose?: () => void;
}

const TModal = {
  show: function(view: React.ReactNode, opts: TModalOptions = {}) {
    return TPopup.show(
      <TModalContainer
        onRequestClose={() =>
          opts.onRequestClose ? opts.onRequestClose() : this.hide()
        }
      >
        {view}
      </TModalContainer>
    );
  },
  hide: function() {
    TPopup.hide();
  },
};

export default TModal;
