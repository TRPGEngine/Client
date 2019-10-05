import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import sb from 'react-native-style-block';
import { TAvatar } from './TComponent';
import styled from 'styled-components/native';

const UnreadPoint = styled.View`
  width: 10px;
  height: 10px;
  background-color: #ec2121;
  border-radius: 5px;
  position: absolute;
  left: 38px;
  bottom: 12px;
`;

interface Props {
  style: any;
  onPress?: () => void;
  icon: string;
  uuid: string;
  title: string;
  time?: string;
  content?: string;
  unread?: boolean;
}
class ConvItem extends React.Component<Props> {
  render() {
    let style = this.props.style;
    if (!(style instanceof Array)) {
      style = [style];
    }

    const { unread } = this.props;

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
        {unread ? <UnreadPoint /> : null}
        <View style={styles.body}>
          <View style={styles.title}>
            <Text style={styles.name}>{this.props.title}</Text>
            <Text style={styles.time}>{this.props.time}</Text>
          </View>
          {this.props.content ? (
            <Text style={styles.msg} numberOfLines={1}>
              {this.props.content}
            </Text>
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

export default ConvItem;
