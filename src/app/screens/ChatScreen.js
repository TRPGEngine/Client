const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  Image,
  FlatList,
  Button,
  TextInput,
} = require('react-native');
const sb = require('react-native-style-block');
const { TInput, TIcon } = require('../components/TComponent');
const appConfig = require('../config.app');
const { sendMsg } = require('../../redux/actions/chat');

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
    let senderInfo = this.props.senderInfo;
    let isSelf = this.props.isSelf;
    let avatar = senderInfo.get('avatar') ? {uri: senderInfo.get('avatar')} : appConfig.defaultImg.user;

    return (
      <View style={[...styles.itemView, isSelf?{flexDirection: 'row-reverse'}:null]}>
        <Image style={styles.itemAvatar} source={avatar} />
        <View style={styles.itemBody}>
          <Text style={[...styles.itemName, isSelf?{textAlign:'right'}:null]}>
            {senderInfo.get('nickname') || senderInfo.get('username')}
          </Text>
          <Text style={[...styles.itemMsg, isSelf?{alignSelf: 'flex-end'}:null]}>{message}</Text>
        </View>
      </View>
    )
  }
}

class ChatScreen extends React.Component {
  static navigationOptions = (props) => {
    const navigation = props.navigation;
    const { state, setParams } = navigation;
    const { params } = state;
    return {
      headerRight: (
        <View style={{marginRight: 10}}>
          <TIcon icon="&#xe607;" onPress={() => params.headerRightFunc && params.headerRightFunc()} />
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
    this.props.navigation.setParams({
      headerRightFunc: () => this.props.navigation.navigate('Profile', this.props.navigation.state.params)
		})
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
            data={msgList}
            keyExtractor={(item, index) => item.uuid + '#' + index}
            renderItem={({item}) => (
              <MsgItem
                isSelf={item.sender_uuid===this.props.selfUUID}
                senderInfo={this.props.usercache.get(item.sender_uuid)}
                data={item}
              />
            )}
          />
          <View style={styles.msgBox}>
            <TInput
              style={styles.msgInput}
              onChangeText={(inputMsg) => this.setState({inputMsg})}
              value={this.state.inputMsg}
            />
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
}

module.exports = connect(
  state => {
    let selectedConversesUUID = state.getIn(['chat', 'selectedConversesUUID']);

    return {
      selectedConversesUUID,
      selfUUID: state.getIn(['user', 'info', 'uuid']),
      msgList: state.getIn(['chat', 'converses', selectedConversesUUID, 'msgList']),
      usercache: state.getIn(['cache', 'user']),
    }
  }
)(ChatScreen);
