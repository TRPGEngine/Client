const React = require('react');
const {
  View,
  Text,
} = require('react-native');
const sb = require('react-native-style-block');
const {
  TAvatar,
} = require('../TComponent');
const dateHelper = require('../../../shared/utils/dateHelper');
const config = require('../../../../config/project.config');

class Base extends React.Component {
  static defaultProps = {
    type: 'normal',
    me: false,
    name: '',
    info: {},
    emphasizeTime: false,
  }

  getContent() {
    return null;
  }

  render() {
    const {
      type,
      me,
      name,
      avatar,
      info,
      emphasizeTime,
    } = this.props;
    let defaultAvatar = info.sender_uuid === 'trpgsystem' ? config.defaultImg.trpgsystem : config.defaultImg.getUser(name);

    return (
      <View style={[...styles.itemView, me ? {flexDirection: 'row-reverse'}:null]}>
        <TAvatar style={styles.itemAvatar} uri={avatar} name={name} height={40} width={40} />
        <View style={styles.itemBody}>
          <Text style={[...styles.itemName, me ? {textAlign:'right'}:null]}>{name}</Text>
          <View style={[...styles.itemMsg, me ? {alignSelf: 'flex-end'}:null]}>
            {this.getContent()}
          </View>
        </View>
      </View>
    )
  }
}

const styles = {
  itemView: [
    sb.direction(),
    sb.padding(10, 10),
  ],
  itemAvatar: [
    sb.radius(20),
  ],
  itemBody: [
    sb.padding(0, 4),
    sb.margin(0, 6),
    sb.flex(),
  ],
  itemName: [
    {marginBottom: 4, marginTop: 4},
    sb.font(12),
  ],
  itemMsg: [
    sb.bgColor(),
    sb.padding(6, 8),
    sb.flex(0),
    sb.radius(3),
    sb.border('all', 0.5, '#ddd'),
    sb.alignSelf('flex-start'),
  ],
}

module.exports = Base;
