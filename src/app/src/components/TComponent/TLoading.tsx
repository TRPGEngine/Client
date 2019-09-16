import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Modal, ActivityIndicator, View, Text } from 'react-native';
import sb from 'react-native-style-block';
import { hideLoading } from '../../../../shared/redux/actions/ui';

interface Props extends DispatchProp<any> {
  showLoading: boolean;
  showLoadingText: string;
}
class TLoading extends React.Component<Props> {
  handleClose() {
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

export default connect((state: any) => ({
  showLoading: state.getIn(['ui', 'showLoading']),
  showLoadingText: state.getIn(['ui', 'showLoadingText']),
}))(TLoading);
