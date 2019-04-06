import React from 'react';
import { View, Text, Image } from 'react-native';
import sb from 'react-native-style-block';
import appConfig from '../config.app';
import { TAvatar } from './TComponent';

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

    if (type === 'tip') {
      return (
        <View style={styles.itemTip}>
          <Text style={styles.itemTipText}>{message}</Text>
        </View>
      );
    } else {
      let senderInfo = this.props.senderInfo;
      let senderUUID = this.props.senderUUID;
      let isSelf = this.props.isSelf;
      let defaultIcon =
        senderUUID === 'trpgsystem'
          ? appConfig.defaultImg.trpgsystem
          : appConfig.defaultImg.user;
      let avatar = senderInfo.get('avatar')
        ? senderInfo.get('avatar')
        : defaultIcon;
      let name = senderInfo.get('nickname') || senderInfo.get('username');

      return (
        <View
          style={[
            ...styles.itemView,
            isSelf ? { flexDirection: 'row-reverse' } : null,
          ]}
        >
          <TAvatar
            style={styles.itemAvatar}
            uri={avatar}
            name={name}
            height={40}
            width={40}
          />
          <View style={styles.itemBody}>
            <Text
              style={[
                ...styles.itemName,
                isSelf ? { textAlign: 'right' } : null,
              ]}
            >
              {name}
            </Text>
            <Text
              style={[
                ...styles.itemMsg,
                isSelf ? { alignSelf: 'flex-end' } : null,
              ]}
            >
              {message}
            </Text>
          </View>
        </View>
      );
    }
  }
}

const styles = {
  itemView: [sb.direction(), sb.padding(10, 10)],
  itemAvatar: [sb.radius(20)],
  itemBody: [sb.padding(0, 4), sb.margin(0, 6), sb.flex()],
  itemName: [{ marginBottom: 4, marginTop: 4 }, sb.font(12)],
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
  itemTipText: [sb.font(12, 16), sb.textAlign()],
};

export default MsgItem;
