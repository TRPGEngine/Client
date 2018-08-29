const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  Image,
  FlatList,
  Button,
  TextInput,
  Keyboard,
} = require('react-native');
const sb = require('react-native-style-block');
const { TInput, TIcon } = require('../components/TComponent');
const MsgItem = require('../components/MsgItem');
const { sendMsg } = require('../../redux/actions/chat');
const { getUserInfoCache } = require('../../utils/cacheHelper');

class ChatScreen extends React.Component {
  static navigationOptions = (props) => {
    const navigation = props.navigation;
    const { state, setParams } = navigation;
    const { params } = state;
    return {
      headerRight: (
        <View style={{marginRight: 10}}>
          <TIcon icon="&#xe607;" style={{fontSize: 26}} onPress={() => params.headerRightFunc && params.headerRightFunc()} />
        </View>
      )
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      inputMsg: '',
    };
  }

  componentDidMount() {
    const converseType = this.props.navigation.getParam('type', 'user');
    this.props.navigation.setParams({
      headerRightFunc: () => {
        if(converseType === 'user') {
          this.props.navigation.navigate('Profile', this.props.navigation.state.params)
        }else {
          alert('TODO: 显示团信息');
        }
      }
		});
    this.keyboardListener = Keyboard.addListener('keyboardDidShow', this._scrollToBottom.bind(this));
    this._scrollToBottom();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.msgList.size !== this.props.msgList.size) {
      this._scrollToBottom();
    }
  }

  componentWillUnmount() {
    this.keyboardListener.remove();
  }

  _scrollToBottom() {
    setTimeout(() => {
      this.refs.list && this.refs.list.scrollToEnd();
    }, 130);
  }

  _handleSendMsg() {
    const uuid = this.props.navigation.getParam('uuid', '');
    const converseType = this.props.navigation.getParam('type', 'user');
    let message = this.state.inputMsg.trim();
    if(!!message) {
      // this.props.onSendMsg(message, type);
      if(!!uuid) {
        let payload = {
          message,
          type: 'normal',
          is_public: false,
          is_group: false,
        }

        if(converseType === 'user') {
          this.props.dispatch(sendMsg(uuid, payload))
        }else if(converseType === 'group') {
          payload.converse_uuid = uuid;
          payload.is_public = true;
          payload.is_group = true;
          this.props.dispatch(sendMsg(null, payload))
        }
      }
      this.setState({inputMsg: ''});
    }
  }

  render() {
    if(this.props.msgList) {
      let msgList = this.props.msgList.toJS();

      return (
        <View style={styles.container}>
          <FlatList
            style={styles.list}
            ref="list"
            data={msgList}
            keyExtractor={(item, index) => item.uuid + '#' + index}
            renderItem={({item}) => {
              let isSelf = item.sender_uuid === this.props.selfInfo.get('uuid');
              let senderInfo = isSelf ? this.props.selfInfo : getUserInfoCache(item.sender_uuid);
              return (
                <MsgItem
                  isSelf={isSelf}
                  senderUUID={item.sender_uuid}
                  senderInfo={senderInfo}
                  data={item}
                />
              )
            }}
          />
          <View style={styles.msgBox}>
            <TInput
              style={styles.msgInput}
              onChangeText={(inputMsg) => this.setState({inputMsg})}
              multiline={true}
              value={this.state.inputMsg}
            />
            {/* TODO: 需要修改为微信那种没有文本内容则是+如果有则是发送按钮 */}
            <Button
              onPress={() => this._handleSendMsg()}
              title="  发送  "
            />
          </View>
        </View>
      )
    }else {
      return (
        <View><Text>Loading...</Text></View>
      )
    }
  }
}

const styles = {
  container: [
    sb.flex(),
  ],
  list: [
    sb.flex(),
  ],
  msgBox: [
    sb.padding(6, 12),
    sb.bgColor(),
    sb.direction(),
  ],
  msgInput: [
    sb.size(null, 35),
    sb.padding(4, 6),
    // sb.border('Bottom', 1, '#ccc'),
    sb.flex(),
    {marginRight: 4},
  ],
}

module.exports = connect(
  state => {
    let selectedConversesUUID = state.getIn(['chat', 'selectedConversesUUID']);

    return {
      selectedConversesUUID,
      selfInfo: state.getIn(['user', 'info']),
      selfUUID: state.getIn(['user', 'info', 'uuid']),
      msgList: state.getIn(['chat', 'converses', selectedConversesUUID, 'msgList']),
      usercache: state.getIn(['cache', 'user']),
    }
  }
)(ChatScreen);
