import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Keyboard,
  EmitterSubscription,
} from 'react-native';
import { Icon } from '@ant-design/react-native';
import sb from 'react-native-style-block';
import ImagePicker from 'react-native-image-picker';
import { NavigationScreenProps } from 'react-navigation';
import { TInput, TIcon } from '../../components/TComponent';
import config from '../../../shared/project.config';
import { sendMsg } from '../../../shared/redux/actions/chat';
import { getUserInfoCache } from '../../../shared/utils/cache-helper';
import dateHelper from '../../../shared/utils/date-helper';
import ExtraPanelItem from '../../components/chat/ExtraPanelItem';
import EmotionPanel from '../../components/chat/EmotionPanel';
import { toNetwork } from '../../../shared/utils/image-uploader';
import { toTemporary } from '../../../shared/utils/upload-helper';
import { unemojify } from '../utils/emoji';
import _get from 'lodash/get';

import MessageHandler from '../../components/messageTypes/__all__';

import styled from 'styled-components/native';

const EXTRA_PANEL_HEIGHT = 220; // 额外面板高度

const ActionBtn = styled.TouchableOpacity`
  align-self: stretch;
  justify-content: center;
  margin: 0px 3px;
`;

const ExtraPanel = styled.View`
  height: ${EXTRA_PANEL_HEIGHT};
  background-color: white;
  border-top-width: 1px;
  border-top-color: #ccc;
`;

const ChatInput = styled(TInput)`
  height: 35;
  padding: 4px 6px;
  flex: 1;
  margin-right: 4px;
`;

interface Props extends DispatchProp<any>, NavigationScreenProps {
  msgList: any;
  selfInfo: any;
  selfUUID: string;
}
class ChatScreen extends React.Component<Props> {
  static navigationOptions = (props) => {
    const navigation = props.navigation;
    const { state, setParams } = navigation;
    const { params } = state;
    const type = params.type;
    return {
      headerRight: ['user', 'group'].includes(type) ? (
        <View style={{ marginRight: 10 }}>
          <TIcon
            icon="&#xe607;"
            style={{ fontSize: 26 } as any}
            onPress={() => params.headerRightFunc && params.headerRightFunc()}
          />
        </View>
      ) : null,
    };
  };

  state = {
    inputMsg: '',
    showExtraPanel: false,
    showEmoticonPanel: false,
    isKeyboardShow: false,
  };

  keyboardDidShowListener: EmitterSubscription;
  keyboardDidHideListener: EmitterSubscription;
  inputRef: TextInput;
  listRef: FlatList<any>;

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
  }

  componentDidUpdate(prevProps, prevState) {
    if (_get(prevProps, 'msgList.size') !== _get(this.props, 'msgList.size')) {
      this._scrollToBottom();
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  dismissAll() {
    Keyboard.dismiss();
    this.setState({
      showExtraPanel: false,
      showEmoticonPanel: false,
    });
  }

  /**
   * 向服务器发送信息
   * @param {string} message 要发送的文本
   */
  sendMsg(message: string) {
    const uuid = this.props.navigation.getParam('uuid', '');
    const converseType = this.props.navigation.getParam('type', 'user');
    if (!!message) {
      // this.props.onSendMsg(message, type);
      if (!!uuid) {
        message = unemojify(message); // 转成标准文本

        let payload: any = {
          message,
          type: 'normal',
          is_public: false,
          is_group: false,
        };

        if (converseType === 'user' || converseType === 'system') {
          this.props.dispatch(sendMsg(uuid, payload));
        } else if (converseType === 'group') {
          payload.converse_uuid = uuid;
          payload.is_public = true;
          payload.is_group = true;
          this.props.dispatch(sendMsg(null, payload));
        }
      }
    } else {
      console.warn('require message to send');
    }
  }

  _scrollToBottom() {
    setTimeout(() => {
      this.listRef && this.listRef.scrollToIndex({ index: 0 }); // 因为使用了inverted属性因此滚到底部对于list的逻辑是滚到顶部
    }, 130);
  }

  handleFocus() {
    // 输入框focus时收起所有面板
    this.setState({
      showExtraPanel: false,
      showEmoticonPanel: false,
    });
  }

  handleSendMsg() {
    let message = this.state.inputMsg.trim();
    if (!!message) {
      this.sendMsg(message);
      this.setState({ inputMsg: '' });
    }
  }

  // 显示表情面板
  handleShowEmoticonPanel() {
    if (this.state.showEmoticonPanel === true) {
      this.setState({ showEmoticonPanel: false, showExtraPanel: false });
      this.inputRef.focus();
    } else {
      this.setState({ showEmoticonPanel: true, showExtraPanel: false });
      this.inputRef.blur();
    }
  }

  // 显示额外面板
  handleShowExtraPanel() {
    if (this.state.showExtraPanel === true) {
      this.setState({ showExtraPanel: false, showEmoticonPanel: false });
      this.inputRef.focus();
    } else {
      this.setState({ showExtraPanel: true, showEmoticonPanel: false });
      this.inputRef.blur();
    }
  }

  /**
   * 额外面板的发送图片功能
   */
  handleSendImage() {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        allowsEditing: true,
        maxWidth: 1200,
        maxHeight: 1200,
      },
      (response) => {
        this.dismissAll();

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const selfUUID = this.props.selfUUID;
          const file = {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          } as any;

          // TODO: 上传到sm.ms
          // toNetwork(this.props.selfUUID, file).then((res) => {
          //   console.log('res', res);
          // });

          // TODO: 暂时先放在服务器上，看看为什么smms不能正常上传(会返回403)
          toTemporary(selfUUID, file, {
            onProgress: (percent) => {
              console.log('percent', percent);
            },
            onCompleted: (res) => {
              // TODO: 待完善: 在聊天界面显示loading
              // 上传完毕。发送图片
              const upload_url = res.upload_url;
              const imageUrl = config.file.getAbsolutePath(upload_url);
              const message = `[img]${imageUrl}[/img]`;

              console.log('message', message);
              this.sendMsg(message);
            },
          });
        }
      }
    );
  }

  // 表情面板的渲染函数
  getEmotionPanel() {
    return (
      <EmotionPanel
        onSelectEmoji={(code) => {
          // 增加到输入框
          const newMsg = this.state.inputMsg + code;
          this.setState({ inputMsg: newMsg });
        }}
        onSelectEmotion={(emotionUrl) =>
          this.sendMsg(`[img]${emotionUrl}[/img]`)
        }
      />
    );
  }

  // 额外面板的渲染函数
  getExtraPanel() {
    return (
      <ExtraPanel>
        <ExtraPanelItem
          text="发送图片"
          icon="&#xe621;"
          onPress={() => this.handleSendImage()}
        />
      </ExtraPanel>
    );
  }

  render() {
    if (this.props.msgList) {
      let msgList: any[] = this.props.msgList.reverse().toJS();

      return (
        <View style={styles.container}>
          <FlatList
            style={styles.list}
            ref={(ref) => (this.listRef = ref)}
            data={msgList}
            inverted={true}
            keyExtractor={(item, index) => item.uuid}
            onTouchStart={() => this.dismissAll()}
            renderItem={({ item, index }) => {
              // 因为列表是倒转的。所以第一条数据是最下面那条
              // UI中的上一条数据应为msgList的下一条
              const prevDate =
                index < msgList.length - 1
                  ? _get(msgList, [index + 1, 'date'])
                  : 0;
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
            <ChatInput
              ref={(ref) => (this.inputRef = ref)}
              onChangeText={(inputMsg) => this.setState({ inputMsg })}
              onFocus={() => this.handleFocus()}
              multiline={true}
              maxLength={100}
              textAlignVertical="center"
              value={this.state.inputMsg}
            />
            <ActionBtn onPress={() => this.handleShowEmoticonPanel()}>
              <Icon name="smile" size={26} />
            </ActionBtn>
            {this.state.inputMsg ? (
              <ActionBtn onPress={() => this.handleSendMsg()}>
                <Text style={{ textAlign: 'center' }}>{'发送'}</Text>
              </ActionBtn>
            ) : (
              <ActionBtn onPress={() => this.handleShowExtraPanel()}>
                <Icon name="plus-circle" size={26} />
              </ActionBtn>
            )}
          </View>
          {this.state.showEmoticonPanel &&
            !this.state.showExtraPanel &&
            !this.state.isKeyboardShow &&
            this.getEmotionPanel()}
          {this.state.showExtraPanel &&
            !this.state.showEmoticonPanel &&
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
};

export default connect((state: any) => {
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
