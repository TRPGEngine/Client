const React = require('react');
const {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Image,
} = require('react-native');
const sb = require('react-native-style-block');

class ConvItem extends React.Component {
  render() {
    let icon = typeof this.props.icon === 'number' ? this.props.icon : {uri: this.props.icon};
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.props.onPress && this.props.onPress()}
      >
        <Image style={styles.avatar} source={icon} />
        <View style={styles.body}>
          <View style={styles.title}>
            <Text style={styles.name}>{this.props.title}</Text>
            <Text style={styles.time}>{this.props.time}</Text>
          </View>
          <Text style={styles.msg}>{this.props.content}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = {
  container: [
    sb.border('Bottom', 0.5, '#ccc', 'solid'),
    sb.direction('row'),
    sb.padding(10, 6),
  ],
  avatar: [
    sb.size(40, 40),
    sb.radius(20),
  ],
  body: [
    sb.flex(),
    sb.padding(0, 4),
  ],
  title: [
    sb.direction('row'),
    // sb.flex(1),
  ],
  name: [
    sb.flex(),
  ],
  time: [
    sb.color('#BDBEBF'),
  ],
  msg: [
    sb.flex(),
    sb.textAlign('left'),
    {paddingTop: 6},
    sb.color('#BDBEBF'),
    sb.font(12),
  ]
}

module.exports = ConvItem;
