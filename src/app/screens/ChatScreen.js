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
      text: '',
    };
    this.data = [];
    for (var i = 0; i < 10; i++) {
      let uuid = Math.random();
      this.data[i] = {
        key: uuid,
        uuid,
        msg: Math.random(),
        name: '222',
        avatar: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2897990660,3885762068&fm=27&gp=0.jpg',
      }
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      headerRightFunc: () => this.props.navigation.navigate('Profile', this.props.navigation.state.params)
		})
  }

  render() {
    if(this.props.msgList) {
      let msgList = this.props.msgList.toJS();

      return (
        <View style={styles.container}>
          <FlatList
            style={styles.list}
            data={msgList}
            keyExtractor={(item, index) => item.uuid}
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
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
            <Button
              onPress={() => alert(this.state.text)}
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
