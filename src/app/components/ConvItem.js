const React = require('react');
const { Text, View, TouchableOpacity, Image } = require('react-native');
const sb = require('react-native-style-block');
const { TAvatar } = require('./TComponent');

class ConvItem extends React.Component {
  render() {
    let style = this.props.style;
    if (!(style instanceof Array)) {
      style = [style];
    }

    return (
      <TouchableOpacity
        style={[styles.container, ...style]}
        onPress={() => this.props.onPress && this.props.onPress()}
      >
        <TAvatar
          style={styles.avatar}
          uri={this.props.icon}
          name={this.props.title}
          height={40}
          width={40}
        />
        <View style={styles.body}>
          <View style={styles.title}>
            <Text style={styles.name}>{this.props.title}</Text>
            <Text style={styles.time}>{this.props.time}</Text>
          </View>
          {this.props.content ? (
            <Text style={styles.msg}>{this.props.content}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  container: [
    sb.border('Bottom', 0.5, '#eeeeee', 'solid'),
    sb.direction('row'),
    sb.padding(10, 6),
    sb.bgColor(),
  ],
  avatar: [sb.radius(20)],
  body: [sb.flex(), sb.padding(0, 4), sb.contentCenter()],
  title: [
    sb.direction('row'),
    // sb.flex(1),
  ],
  name: [sb.flex()],
  time: [sb.color('#BDBEBF')],
  msg: [
    sb.flex(),
    sb.textAlign('left'),
    { paddingTop: 6 },
    sb.color('#BDBEBF'),
    sb.font(12),
  ],
};

module.exports = ConvItem;
