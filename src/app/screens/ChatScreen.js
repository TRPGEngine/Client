import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  Image,
  FlatList,
  Button,
  TextInput,
  Keyboard,
} from 'react-native';
import sb from 'react-native-style-block';
import { TInput, TIcon } from '../components/TComponent';
import config from '../../../config/project.config';
import { sendMsg } from '../../redux/actions/chat';
import { getUserInfoCache } from '../../shared/utils/cacheHelper';
import dateHelper from '../../shared/utils/dateHelper';
import ExtraPanelItem from '../components/ExtraPanelItem';

import MessageHandler from '../../shared/components/MessageHandler';
import Default from '../components/messageTypes/Default';
import Tip from '../components/messageTypes/Tip';
import Card from '../components/messageTypes/Card';
import File from '../components/messageTypes/File';
MessageHandler.registerDefaultMessageHandler(Default);
MessageHandler.registerMessageHandler('tip', Tip);
MessageHandler.registerMessageHandler('card', Card);
MessageHandler.registerMessageHandler('file', File);

class ChatScreen extends React.Component {
  static navigationOptions = (props) => {
    const navigation = props.navigation;
    const { state, setParams } = navigation;
    const { params } = state;
    return {
      headerRight: (
        <View style={{ marginRight: 10 }}>
          <TIcon
            icon="&#xe607;"
            style={{ fontSize: 26 }}
            onPress={() => params.headerRightFunc && params.headerRightFunc()}
          />
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      inputMsg: '',
      showExtraPanel: false,
      isKeyboardShow: false,
    };
  }

  componentDidMount() {
    const converseType = this.props.navigation.getParam('type', 'user');
    this.props.navigation.setParams({
      headerRightFunc: () => {
        if (converseType === 'user') {
          this.props.navigation.navigate(
            'Profile',
            this.props.navigation.state.params
          );
        } else {
          this.props.navigation.navigate(
            'GroupProfile',
            this.props.navigation.state.params
          );
        }
      },
    });
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        this.setState({ isKeyboardShow: true });
        this._scrollToBottom.bind(this);
      }
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        this.setState({ isKeyboardShow: false });
      }
    );
    this._scrollToBottom();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.msgList.size !== this.props.msgList.size) {
      this._scrollToBottom();
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _scrollToBottom() {
    setTimeout(() => {
      this.refs.list && this.refs.list.scrollToEnd();
    }, 130);
  }

  _handleFocus() {
    // 输入框focus时收起ExtraPanel
    this.setState({ showExtraPanel: false });
  }

  _handleSendMsg() {
    const uuid = this.props.navigation.getParam('uuid', '');
    const converseType = this.props.navigation.getParam('type', 'user');
    let message = this.state.inputMsg.trim();
    if (!!message) {
      // this.props.onSendMsg(message, type);
      if (!!uuid) {
        let payload = {
          message,
          type: 'normal',
          is_public: false,
          is_group: false,
        };

        if (converseType === 'user') {
          this.props.dispatch(sendMsg(uuid, payload));
        } else if (converseType === 'group') {
          payload.converse_uuid = uuid;
          payload.is_public = true;
          payload.is_group = true;
          this.props.dispatch(sendMsg(null, payload));
        }
      }
      this.setState({ inputMsg: '' });
    }
  }

  _handleShowExtraPanel() {
    if (this.state.showExtraPanel === true) {
      this.setState({ showExtraPanel: false });
      this.refs['input'].focus();
    } else {
      this.setState({ showExtraPanel: true });
      this.refs['input'].blur();
      this._scrollToBottom();
    }
  }

  getExtraPanel() {
    return (
      <View style={styles.extraPanel}>
        <ExtraPanelItem
          text="发送图片"
          icon="&#xe621;"
          onPress={() => alert('未实现')}
        />
      </View>
    );
  }

  render() {
    if (this.props.msgList) {
      let msgList = this.props.msgList.toJS();

      return (
        <View style={styles.container}>
          <FlatList
            style={styles.list}
            ref="list"
            data={msgList}
            keyExtractor={(item, index) => item.uuid + '#' + index}
            renderItem={({ item, index }) => {
              const prevDate =
                index > 0 ? this.props.msgList.getIn([index - 1, 'date']) : 0;
              let isMe = item.sender_uuid === this.props.selfInfo.get('uuid');
              let senderInfo = isMe
                ? this.props.selfInfo
                : getUserInfoCache(item.sender_uuid);
              let name =
                senderInfo.get('nickname') || senderInfo.get('username');
              let avatar = senderInfo.get('avatar');
              let defaultAvatar =
                item.sender_uuid === 'trpgsystem'
                  ? config.defaultImg.trpgsystem
                  : config.defaultImg.getUser(name);
              let date = item.date;

              let diffTime = dateHelper.getDateDiff(prevDate, date);
              let emphasizeTime = diffTime / 1000 / 60 >= 10; // 超过10分钟

              return (
                <MessageHandler
                  key={item.uuid}
                  type={item.type}
                  me={isMe}
                  name={name}
                  avatar={avatar || defaultAvatar}
                  emphasizeTime={emphasizeTime}
                  info={item}
                />
              );
            }}
          />
          <View style={styles.msgBox}>
            <TInput
              ref="input"
              style={styles.msgInput}
              onChangeText={(inputMsg) => this.setState({ inputMsg })}
              onFocus={() => this._handleFocus()}
              multiline={true}
              maxLength={100}
              value={this.state.inputMsg}
            />
            {this.state.inputMsg ? (
              <Button onPress={() => this._handleSendMsg()} title="  发送  " />
            ) : (
              <Button
                onPress={() => this._handleShowExtraPanel()}
                title="   ＋   "
              />
            )}
          </View>
          {this.state.showExtraPanel &&
            !this.state.isKeyboardShow &&
            this.getExtraPanel()}
        </View>
      );
    } else {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
  }
}

const styles = {
  container: [sb.flex()],
  list: [sb.flex()],
  msgBox: [sb.padding(6, 12), sb.bgColor(), sb.direction()],
  msgInput: [
    sb.size(null, 35),
    sb.padding(4, 6),
    // sb.border('Bottom', 1, '#ccc'),
    sb.flex(),
    { marginRight: 4 },
  ],
  extraPanel: [sb.size(null, 265), sb.bgColor(), sb.border('Top', 0.5, '#ccc')],
};

export default connect((state) => {
  let selectedConversesUUID = state.getIn(['chat', 'selectedConversesUUID']);
  let msgList = state.getIn([
    'chat',
    'converses',
    selectedConversesUUID,
    'msgList',
  ]);

  return {
    selectedConversesUUID,
    selfInfo: state.getIn(['user', 'info']),
    selfUUID: state.getIn(['user', 'info', 'uuid']),
    msgList: msgList && msgList.sortBy((item) => item.get('date')),
    usercache: state.getIn(['cache', 'user']),
  };
})(ChatScreen);
