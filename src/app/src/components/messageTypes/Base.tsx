import React, { Fragment } from 'react';
import { View, Text } from 'react-native';
import sb from 'react-native-style-block';
import { TAvatar, TIcon } from '../TComponent';
import dateHelper from '@shared/utils/date-helper';
import { MessageProps } from '@shared/components/message/MessageHandler';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _invoke from 'lodash/invoke';
import _isString from 'lodash/isString';
import { getAbsolutePath } from '@shared/utils/file-helper';
import { TipMessage } from '../TipMessage';
import { Popover, ActivityIndicator } from '@ant-design/react-native';
import PopoverMsgSenderInfo from '../popover/MsgSenderInfo';
import styled from 'styled-components/native';
import { isUserOrGroupUUID } from '@shared/utils/uuid';
import styledTheme from '@shared/utils/theme';

const MsgContainer = styled.View<{ me: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.me ? 'row-reverse' : 'row')};
`;

const MsgBubble = styled.View<{
  me: boolean;
  isMsgPadding: boolean;
}>`
  background-color: white;
  padding: ${(props) => (props.isMsgPadding ? '6px 8px' : 0)};
  border-radius: 3px;
  border: 0.5px solid #ddd;
  align-self: ${(props) => (props.me ? 'flex-end' : 'flex-start')};
`;

const MsgTypeIcon = styled(TIcon)`
  margin: 0 4px;
  align-self: center;
`;

class Base<P extends MessageProps = MessageProps> extends React.PureComponent<
  P
> {
  static defaultProps = {
    type: 'normal',
    me: false,
    name: '',
    info: {},
    emphasizeTime: false,
  };

  /**
   * 处理不同消息类型
   */
  msgBubbleType = {
    action: (children: React.ReactNode) => {
      const me = this.props.me;

      return (
        <Fragment>
          <MsgBubble
            me={me}
            isMsgPadding={this.isMsgPadding}
            style={{ borderColor: styledTheme.color['hit-pink'] }}
          >
            {children}
          </MsgBubble>
          <MsgTypeIcon
            icon="&#xe619;"
            style={{
              color: styledTheme.color['hit-pink'],
            }}
          />
        </Fragment>
      );
    },
    speak: (children: React.ReactNode) => {
      const me = this.props.me;

      return (
        <Fragment>
          <MsgBubble
            me={me}
            isMsgPadding={this.isMsgPadding}
            style={{ borderColor: styledTheme.color['periwinkle'] }}
          >
            {children}
          </MsgBubble>
          <MsgTypeIcon
            icon="&#xe61f;"
            style={{
              color: styledTheme.color['periwinkle'],
            }}
          />
        </Fragment>
      );
    },
    ooc: (children: React.ReactNode) => {
      const me = this.props.me;

      return (
        <MsgBubble
          me={me}
          isMsgPadding={this.isMsgPadding}
          style={{
            borderColor: styledTheme.color['silver'],
            borderStyle: 'dashed',
            opacity: 0.5,
          }}
        >
          {children}
        </MsgBubble>
      );
    },
    normal: (children: React.ReactNode) => {
      const me = this.props.me;

      return (
        <MsgBubble me={me} isMsgPadding={this.isMsgPadding}>
          {children}
        </MsgBubble>
      );
    },
  };

  /**
   * 是否应用消息内边距
   */
  get isMsgPadding() {
    return true;
  }

  /**
   * 返回信息显示的发送者的名字
   * 获取顺序: 消息信息内发送者名 -> 传递来的名字(原始名)
   */
  getSenderName(): string {
    const { name, info } = this.props;

    return _get(info, 'data.name') || name;
  }

  /**
   * 返回信息avatar的地址
   * 获取顺序: 消息信息内头像 -> 传递来的头像(发送者)
   */
  getAvatarUrl(): string {
    const { avatar, info } = this.props;

    const dataAvatar = getAbsolutePath(_get(info, 'data.avatar', ''));

    return dataAvatar || avatar;
  }

  getContent() {
    return null;
  }

  checkSenderIsUser(): boolean {
    return isUserOrGroupUUID(_get(this.props.info, ['sender_uuid']));
  }

  get isLoading(): boolean {
    const { info } = this.props;

    return _isString(info.uuid) && info.uuid.startsWith('local');
  }

  render() {
    const { type, me, name, info, emphasizeTime } = this.props;
    const isLoading = this.isLoading;

    if (info.revoke === true) {
      return <TipMessage text={`${name} 撤回了一条消息`} />;
    }

    return (
      <View>
        {emphasizeTime ? (
          <Text style={styles.itemTime}>
            {dateHelper.getShortDate(info.date)}
          </Text>
        ) : null}
        <View
          style={[
            ...styles.itemView,
            me ? { flexDirection: 'row-reverse' } : null,
          ]}
        >
          {this.checkSenderIsUser() ? (
            <Popover
              overlay={<PopoverMsgSenderInfo payload={info} />}
              placement={me ? 'left' : 'right'}
            >
              <TAvatar
                uri={this.getAvatarUrl()}
                name={name}
                height={40}
                width={40}
              />
            </Popover>
          ) : (
            <TAvatar
              uri={this.getAvatarUrl()}
              name={name}
              height={40}
              width={40}
            />
          )}

          <View style={styles.itemBody}>
            <Text
              style={[...styles.itemName, me ? { textAlign: 'right' } : null]}
            >
              {this.getSenderName()}
            </Text>
            <MsgContainer me={me}>
              {/* 不同消息类型的显示 */}
              {_has(this.msgBubbleType, type)
                ? _invoke(this.msgBubbleType, type, this.getContent())
                : this.msgBubbleType['normal'](this.getContent())}

              {isLoading && <ActivityIndicator />}
            </MsgContainer>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  itemTime: [
    sb.margin(10, 'auto', 0),
    sb.color('rgba(0, 0, 0, 0.2)'),
    sb.padding(4, 10),
    sb.font(10, 14),
  ],
  itemView: [sb.direction(), sb.padding(10, 10)],
  itemBody: [sb.padding(0, 4), sb.margin(0, 6), sb.flex()],
  itemName: [{ marginBottom: 4, marginTop: 4 }, sb.font(12)],
};

export default Base;
