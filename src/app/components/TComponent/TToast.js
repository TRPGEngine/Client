import Toast from 'react-native-root-toast';
import React from 'react';
import { connect } from 'react-redux';

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

export default connect((state) => ({
  showToast: state.getIn(['ui', 'showToast']),
  showToastText: state.getIn(['ui', 'showToastText']),
}))(TToast);
