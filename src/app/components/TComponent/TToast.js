import Toast from 'react-native-root-toast';
const React = require('react');
const { connect } = require('react-redux');

class TToast extends React.Component {
  render() {
    return (
      <Toast
        visible={this.props.showToast}
        position={Toast.positions.BOTTOM}
        shadow={false}
        animation={true}
        hideOnPress={true}
        {...this.props}
      >
        {this.props.showToastText}
      </Toast>
    );
  }
}

module.exports = connect((state) => ({
  showToast: state.getIn(['ui', 'showToast']),
  showToastText: state.getIn(['ui', 'showToastText']),
}))(TToast);
