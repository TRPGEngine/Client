import React from 'react';
import { connect, DispatchProp } from 'react-redux';
const {
  Text,
  View,
  Modal,
  Button,
  TouchableNativeFeedback,
} = require('react-native');
import sb from 'react-native-style-block';
import TButton from './TButton';
import { hideAlert } from '../../../../shared/redux/actions/ui';
import { TRPGState } from '@redux/types/__all__';

interface Props extends DispatchProp<any> {
  showAlertInfo: any;
  showAlert: boolean;
  style: any;
}
class TAlert extends React.Component<Props> {
  static defaultProps = {
    style: [],
  };

  render() {
    const title = this.props.showAlertInfo.title || '';
    const content = this.props.showAlertInfo.content;
    const confirmTitle = this.props.showAlertInfo.confirmTitle;
    const onConfirm = this.props.showAlertInfo.onConfirm;
    const onCancel = this.props.showAlertInfo.onCancel;

    let header, cancelBtn;
    if (title) {
      header = (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      );
    }

    if (onConfirm) {
      cancelBtn = (
        <TButton
          style={[styles.btn, styles.cancelBtn]}
          textStyle={{ color: '#666' } as any}
          onPress={() =>
            onCancel ? onCancel() : this.props.dispatch(hideAlert())
          }
        >
          取消
        </TButton>
      );
    }

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.showAlert}
        onRequestClose={() => console.log('request modal close.')}
      >
        <View style={styles.container}>
          <View style={styles.view}>
            {header}
            <View style={styles.body}>
              <Text style={styles.text}>{content || '确认进行该操作?'}</Text>
            </View>
            <View style={styles.footer}>
              {cancelBtn}
              <TButton
                style={styles.btn}
                onPress={() =>
                  onConfirm ? onConfirm() : this.props.dispatch(hideAlert())
                }
              >
                {confirmTitle || '确认'}
              </TButton>
            </View>
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
      minWidth: 280,
      minHeight: 180,
      maxWidth: 280,
      maxHeight: 240,
    },
    sb.bgColor('#f1f1f1'),
    sb.radius(10),
    sb.padding(10),
  ],
  header: [sb.border('Bottom', 0.5, '#ccc'), sb.padding(4, 0, 8, 0)],
  body: [sb.flex(), sb.center(), sb.padding(14, 0, 10, 0)],
  title: [sb.textAlign(), sb.font(22)],
  text: [sb.textAlign(), sb.font(16)],
  footer: [sb.direction()],
  btn: [sb.flex(), sb.margin(4, 6)],
  cancelBtn: [sb.bgColor('white')],
};

export default connect((state: TRPGState) => ({
  showAlert: state.ui.showAlert,
  showAlertInfo: state.ui.showAlertInfo,
}))(TAlert);
