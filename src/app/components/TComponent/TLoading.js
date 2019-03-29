const React = require('react');
const { connect } = require('react-redux');
const { Modal, ActivityIndicator, View, Text } = require('react-native');
const sb = require('react-native-style-block');
const { hideLoading } = require('../../../redux/actions/ui');

class TLoading extends React.Component {
  _handleClose() {
    this.props.dispatch(hideLoading());
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.showLoading}
        onRequestClose={() => console.log('request modal close.')}
      >
        <View style={styles.container}>
          <View style={styles.view}>
            <ActivityIndicator
              animating={this.props.showLoading}
              style={styles.indicator}
              size="large"
            />
            <Text style={styles.text}>{this.props.showLoadingText}</Text>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = {
  container: [sb.bgColor('rgba(0,0,0,0.2)'), sb.flex(), sb.center()],
  view: [
    {
      minWidth: 150,
      minHeight: 150,
      maxWidth: 240,
      maxHeight: 240,
    },
    sb.bgColor('rgba(0, 0, 0, 0.8)'),
    sb.center(),
    sb.radius(10),
    sb.padding(10),
  ],
  indicator: [
    sb.center(),
    sb.size(null, 50),
    sb.padding(8),
    { transform: [{ scale: 1.5 }] },
    sb.flex(),
  ],
  text: [sb.color(), { paddingBottom: 10 }],
};

module.exports = connect((state) => ({
  showLoading: state.getIn(['ui', 'showLoading']),
  showLoadingText: state.getIn(['ui', 'showLoadingText']),
}))(TLoading);
