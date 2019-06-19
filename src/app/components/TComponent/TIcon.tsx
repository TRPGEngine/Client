import React from 'react';
import { Text } from 'react-native';
import sb from 'react-native-style-block';

class TIcon extends React.Component {
  static defaultProps = {
    style: [],
    icon: '',
  };

  render() {
    let style = this.props.style;
    if (!(style instanceof Array)) {
      style = [style];
    }

    return (
      <Text {...this.props} style={[styles.text, ...style]}>
        {this.props.icon}
      </Text>
    );
  }
}

const styles = {
  text: {
    fontFamily: 'iconfont',
  },
};

export default TIcon;
