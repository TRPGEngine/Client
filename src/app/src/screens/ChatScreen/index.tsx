import React, { Fragment } from 'react';
import { connect, DispatchProp } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  Keyboard,
  EmitterSubscription,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { NavigationScreenProps } from 'react-navigation';
import { TIcon } from '@app/components/TComponent';
import {
  sendMsg,
  getMoreChatLog,
  addLoadingMsg,
  clearSelectedConverse,
} from '@shared/redux/actions/chat';
import ExtraPanelItem from '@app/components/chat/ExtraPanelItem';
import EmotionPanel from '@app/components/chat/EmotionPanel';
import QuickDiceModal from '@app/components/chat/QuickDiceModal';
import { uploadChatimg } from '@shared/utils/image-uploader';
import { unemojify } from '@shared/utils/emoji';
import _get from 'lodash/get';
import { ChatParams } from '../../types/params';

import styled from 'styled-components/native';
import { sendQuickDice } from '@src/shared/redux/actions/dice';
import InputView from './InputView';
import MsgList from './MsgList';

const EXTRA_PANEL_HEIGHT = 220; // 额外面板高度

const ExtraPanel = styled.View`
  height: ${EXTRA_PANEL_HEIGHT};
  background-color: white;
  border-top-width: 1px;
  border-top-color: #ccc;
  flex-direction: row;
`;

type Params = ChatParams & { headerRightFunc?: () => void };

interface Props extends DispatchProp<any>, NavigationScreenProps<Params> {
  msgList: any;
  selfInfo: any;
  selfUUID: string;
  nomore: boolean;
  selectedConverseUUID: string;
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
    showQuickDiceModal: false,
  };

  keyboardDidShowListener: EmitterSubscription;
  keyboardDidHideListener: EmitterSubscription;
  inputRef = React.createRef<TextInput>();

  componentDidMount() {
    const converseType = this.props.navigation.getParam('type', 'user');

    this.props.navigation.setParams({
      headerRightFunc: () => {
        if (converseType === 'user') {
          this.props.navigation.navigate(
            'Profile',
            this.props.navigation.state.params
          );
        } else if (converseType === 'group') {
          this.props.navigation.navigate(
            'GroupData',
            this.props.navigation.state.params
          );
        }
      },
    });
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        this.setState({ isKeyboardShow: true });
      }
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        this.setState({ isKeyboardShow: false });
      }
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  dismissAll = () => {
    Keyboard.dismiss();
    this.setState({
      showExtraPanel: false,
      showEmoticonPanel: false,
    });
  };

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

  /**
   * 处理请求更多聊天记录事件
   */
  handleRequestMoreChatLog = () => {
    const date = this.props.msgList.first().get('date');
    const { selectedConverseUUID } = this.props;
    const converseType = this.props.navigation.getParam('type', 'user');
    this.props.dispatch(
      getMoreChatLog(selectedConverseUUID, date, converseType === 'user')
    );
  };

  handleFocus = () => {
    // 输入框focus时收起所有面板
    this.setState({
      showExtraPanel: false,
      showEmoticonPanel: false,
    });
  };

  handleSendMsg = () => {
    let message = this.state.inputMsg.trim();
    if (!!message) {
      this.sendMsg(message);
      this.setState({ inputMsg: '' });
    }
  };

  // 显示表情面板
  handleShowEmoticonPanel = () => {
    if (this.state.showEmoticonPanel === true) {
      this.setState({ showEmoticonPanel: false, showExtraPanel: false });
      this.inputRef.current.focus();
    } else {
      this.setState({ showEmoticonPanel: true, showExtraPanel: false });
      this.inputRef.current.blur();
    }
  };

  // 显示额外面板
  handleShowExtraPanel = () => {
    if (this.state.showExtraPanel === true) {
      this.setState({ showExtraPanel: false, showEmoticonPanel: false });
      this.inputRef.current.focus();
    } else {
      this.setState({ showExtraPanel: true, showEmoticonPanel: false });
      this.inputRef.current.blur();
    }
  };

  /**
   * 额外面板的发送图片功能
   */
  handleSendImage = () => {
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

          const uuid = this.props.navigation.getParam('uuid', '');
          this.props.dispatch(
            addLoadingMsg(uuid, ({ updateProgress, removeLoading }) => {
              uploadChatimg(file, {
                onUploadProgress(percent) {
                  updateProgress(percent); // 更新loading百分比
                },
              }).then((imageUrl) => {
                removeLoading(); // 移除loading消息
                const message = `[img]${imageUrl}[/img]`;
                console.log('message', message);
                this.sendMsg(message);
              });
            })
          );
        }
      }
    );
  };

  handleSendQuickDice = (diceExp: string) => {
    const uuid = this.props.navigation.getParam('uuid', '');
    const converseType = this.props.navigation.getParam('type', 'user');
    const isGroup = converseType === 'group';
    this.props.dispatch(sendQuickDice(uuid, isGroup, diceExp));
    this.setState({ showQuickDiceModal: false });
  };

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
          onPress={this.handleSendImage}
        />
        <ExtraPanelItem
          text="投骰"
          icon="&#xe6fd;"
          onPress={() => this.setState({ showQuickDiceModal: true })}
        />
      </ExtraPanel>
    );
  }

  getModal() {
    return (
      <Fragment>
        <QuickDiceModal
          visible={this.state.showQuickDiceModal}
          onClose={() => this.setState({ showQuickDiceModal: false })}
          onSend={this.handleSendQuickDice}
        />
      </Fragment>
    );
  }

  render() {
    if (this.props.msgList) {
      let msgList: any[] = this.props.msgList.reverse().toJS();

      return (
        <View style={{ flex: 1 }}>
          <MsgList
            msgList={msgList}
            selfInfo={this.props.selfInfo}
            nomore={this.props.nomore}
            onTouchStart={this.dismissAll}
            onRequestMoreChatLog={this.handleRequestMoreChatLog}
          />
          <InputView
            inputRef={this.inputRef}
            value={this.state.inputMsg}
            onChange={(inputMsg) => this.setState({ inputMsg })}
            onSendMsg={this.handleSendMsg}
            onFocus={this.handleFocus}
            onShowEmoticonPanel={this.handleShowEmoticonPanel}
            onShowExtraPanel={this.handleShowExtraPanel}
          />
          {this.state.showEmoticonPanel &&
            !this.state.showExtraPanel &&
            !this.state.isKeyboardShow &&
            this.getEmotionPanel()}
          {this.state.showExtraPanel &&
            !this.state.showEmoticonPanel &&
            !this.state.isKeyboardShow &&
            this.getExtraPanel()}
          {this.getModal()}
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

export default connect((state: any, ownProps: any) => {
  const selectedConverseUUID = _get(
    ownProps,
    'navigation.state.params.uuid',
    ''
  );

  const msgList = state.getIn([
    'chat',
    'converses',
    selectedConverseUUID,
    'msgList',
  ]);

  return {
    selectedConverseUUID,
    selfInfo: state.getIn(['user', 'info']),
    selfUUID: state.getIn(['user', 'info', 'uuid']),
    msgList: msgList && msgList.sortBy((item) => item.get('date')),
    usercache: state.getIn(['cache', 'user']),
    nomore: state.getIn(
      ['chat', 'converses', selectedConverseUUID, 'nomore'],
      false
    ),
  };
})(ChatScreen);
