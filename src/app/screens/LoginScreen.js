const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  TouchableOpacity,
} = require('react-native');
const { NavigationActions } = require('react-navigation');
const sb = require('react-native-style-block');
const { login } = require('../../redux/actions/user');
const { TButton, TFormGroup, TLoading } = require('../components/TComponent');

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
        <TButton
          onPress={() => this._handleLogin()}
        >登录</TButton>
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => this.props.dispatch(NavigationActions.navigate({ routeName: 'Register' }))}
        >
          <Text style={styles.registerText}>没有账户？点击此处注册</Text>
        </TouchableOpacity>
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
  registerBtn: [
    sb.bgColor('transparent'),
    {marginTop: 10, height: 32},
  ],
  registerText: [
    sb.color('#2f9bd7'),
    sb.textAlign('right'),
    sb.font(14),
  ],
}

module.exports = connect()(LoginScreen);
