const React = require('react');
const {
  Text,
  TouchableOpacity,
  Image,
} = require('react-native');
const sb = require('react-native-style-block');

class ListCell extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.props.onPress && this.props.onPress()}
      >
        <Text style={[styles.icon, {color: this.props.color}]}>{this.props.icon}</Text>
        <Text style={styles.title}>{this.props.title}</Text>
        {
          this.props.onPress ? (
            <Text style={[styles.icon, ...styles.arrow]}>&#xe60e;</Text>
          ) : null
        }
      </TouchableOpacity>
    )
  }
}

const styles = {
  container: [
    sb.direction(),
    sb.bgColor(),
    sb.border('Top', 0.5, '#ccc'),
    sb.border('Bottom', 0.5, '#ccc'),
    sb.padding(4, 8),
    sb.alignCenter(),
    {height: 44},
  ],
  icon: {
    fontFamily: 'iconfont',
    fontSize: 26,
    marginRight: 6,
  },
  title: [
    sb.flex(),
    sb.font(16),
  ],
  arrow: [
    sb.font(18),
    sb.color('#ccc'),
  ]
}

module.exports = ListCell;
