import React from 'react';
import { View, Text } from 'react-native';
import sb from 'react-native-style-block';
import Base from './Base';

class Tip extends Base {
  render() {
    const info = this.props.info;
    return (
      <View style={styles.tipContainer}>
        <Text style={styles.tipText}>{info.message}</Text>
      </View>
    );
  }
}

const styles = {
  tipContainer: [
    sb.bgColor('rgba(0, 0, 0, 0.1)'),
    sb.size(200, null),
    sb.alignSelf('center'),
    sb.padding(4, 10),
    sb.radius(3),
    sb.margin(5, 0),
  ],
  tipText: [sb.color('white'), sb.font(12, 16), sb.textAlign()],
};

export default Tip;
