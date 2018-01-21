const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  Button,
} = require('react-native');
const sb = require('react-native-style-block');
const { login } = require('../../redux/actions/user');
const { TFormGroup, TLoading } = require('../components/TComponent');

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Text style={{fontFamily:'iconfont', fontSize: 26, color: tintColor}}>&#xe958;</Text>
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  _handleLogin() {
    let {username, password} = this.state;
    console.log(username, password);
    if(!!username && !!password) {
      this.props.dispatch(login(this.state.username, this.state.password));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TLoading />
        <Text style={styles.title}>欢迎来到TRPG Game</Text>
        <TFormGroup
          label="用户名"
          value={this.state.username}
          onChangeText={(username) => this.setState({username})}
          input={{
            placeholder: "请输入用户名",
          }}
        />
        <TFormGroup
          label="密码"
          value={this.state.password}
          onChangeText={(password) => this.setState({password})}
          input={{
            placeholder: "请输入密码",
            secureTextEntry: true
          }}
        />
        <Button
          title="登录"
          onPress={() => this._handleLogin()}
        />
      </View>
    )
  }
}

const styles = {
  container: [
    // sb.alignCenter(),
    sb.flex(),
    sb.padding(80, 20, 0),
  ],
  title: [
    sb.textAlign('left'),
    sb.font(20),
    {paddingLeft: 10, marginBottom: 20}
  ],
  input: [
    {
      marginBottom: 10,
    }
  ]
}

module.exports = connect()(LoginScreen);
