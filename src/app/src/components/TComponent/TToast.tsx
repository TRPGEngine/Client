import Toast from 'react-native-root-toast';
import React from 'react';
import { connect } from 'react-redux';
import { TRPGState } from '@redux/types/__all__';

interface Props {
  showToast: boolean;
  showToastText: string;
}
class TToast extends React.Component<Props> {
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

export default connect((state: TRPGState) => ({
  showToast: state.ui.showToast,
  showToastText: state.ui.showToastText,
}))(TToast);
