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
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <Image style={styles.avatar} source={{uri: this.props.avatar}} />
        <View style={styles.body}>
          <View style={styles.title}>
            <Text style={styles.name}>{this.props.name}</Text>
            <Text style={styles.time}>{this.props.time}</Text>
          </View>
          <Text style={styles.msg}>{this.props.msg}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = {
  container: [
    sb.border('Bottom', 0.5, '#ccc', 'solid'),
    sb.direction('row'),
    sb.padding(6),
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
