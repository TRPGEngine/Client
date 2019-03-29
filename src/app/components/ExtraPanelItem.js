const React = require('react');
const { View, Text, TouchableOpacity } = require('react-native');
const sb = require('react-native-style-block');
const { TIcon } = require('./TComponent');

class ExtraPanelItem extends React.Component {
  render() {
    const { icon, text, onPress } = this.props;
    console.log('icon', icon);

    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={styles.iconContainer}>
          <TIcon style={styles.icon} icon={icon} />
        </View>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = {
  container: [sb.margin(10), sb.size(80, null)],
  iconContainer: [
    sb.size(60, 60),
    sb.border('all', 0.5, '#ccc'),
    sb.radius(3),
    sb.margin(10),
  ],
  icon: [sb.color('#ccc'), sb.font(32), sb.textAlign(), { lineHeight: 60 }],
  text: [sb.color('#666'), sb.textAlign(), sb.font(12)],
};

module.exports = ExtraPanelItem;
