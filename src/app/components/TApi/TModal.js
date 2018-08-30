const React = require('react');
const {
  View,
  Modal,
  TouchableWithoutFeedback,
} = require('react-native');
const sb = require('react-native-style-block');
const TPopup = require('./TPopup');

const styles = {
  container: [
    sb.flex(),
    sb.center(),
  ],
  mask: [
    sb.position('absolute', 0, 0, 0, 0),
    sb.bgColor('rgba(0, 0, 0, 0.2)'),
  ],
  view: [
    sb.padding(10),
    sb.bgColor(),
    sb.radius(3),
    {minWidth: 240, minHeight: 320},
  ]
}

class TModalContainer extends React.Component {
  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        onRequestClose={this.props.onRequestClose}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={this.props.onRequestClose}
          >
            <View style={styles.mask}></View>
          </TouchableWithoutFeedback>

          <View style={styles.view}>
            {this.props.children}
          </View>
        </View>
      </Modal>
    )
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
  }
}

module.exports = TModal;
