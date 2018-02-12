const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
} = require('react-native');
const sb = require('react-native-style-block');
const { TInput, TIcon } = require('../components/TComponent');

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
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.data}
          renderItem={({item}) => (<Text>{item.msg}</Text>)}
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

module.exports = connect()(ChatScreen);
