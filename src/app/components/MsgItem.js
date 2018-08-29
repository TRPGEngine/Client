const React = require('react');
const {
  View,
  Text,
  Image,
} = require('react-native');
const sb = require('react-native-style-block');
const appConfig = require('../config.app');
const { TAvatar } = require('./TComponent');

class MsgItem extends React.Component {
  render() {
    let {
      converse_uuid,
      data,
      date,
      is_group,
      is_public,
      message,
      sender_uuid,
      to_uuid,
      type,
      uuid,
    } = this.props.data;


    if(type === 'tip') {
      return (
        <View style={styles.itemTip}>
          <Text style={styles.itemTipText}>{message}</Text>
        </View>
      )
    }else {
      let senderInfo = this.props.senderInfo;
      let senderUUID = this.props.senderUUID;
      let isSelf = this.props.isSelf;
      let defaultIcon = senderUUID === 'trpgsystem' ? appConfig.defaultImg.trpgsystem : appConfig.defaultImg.user;
      let avatar = senderInfo.get('avatar') ? senderInfo.get('avatar') : defaultIcon;
      let name = senderInfo.get('nickname') || senderInfo.get('username');

      return (
        <View style={[...styles.itemView, isSelf?{flexDirection: 'row-reverse'}:null]}>
          <TAvatar style={styles.itemAvatar} uri={avatar} name={name} />
          <View style={styles.itemBody}>
            <Text style={[...styles.itemName, isSelf?{textAlign:'right'}:null]}>{name}</Text>
            <Text style={[...styles.itemMsg, isSelf?{alignSelf: 'flex-end'}:null]}>{message}</Text>
          </View>
        </View>
      )
    }
  }
}

const styles = {
  itemView: [
    sb.direction(),
    sb.padding(10, 10),
  ],
  itemAvatar: [
    sb.size(40, 40),
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
  itemTip: [
    sb.bgColor('#ccc'),
    sb.size(200, null),
    sb.alignSelf('center'),
    sb.padding(6, 10),
    sb.radius(3),
    sb.margin(5, 0),
  ],
  itemTipText: [
    sb.font(12, 16),
    sb.textAlign(),
  ],
}

module.exports = MsgItem;
