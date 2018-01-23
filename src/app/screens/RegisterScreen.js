const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
} = require('react-native');
const sb = require('react-native-style-block');
const { TButton, TFormGroup, TLoading } = require('../components/TComponent');
const { showLoading, showAlert } = require('../../redux/actions/ui');
const { register } = require('../../redux/actions/user');

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordRepeat: '',
    };
  }

  checkInputErr() {
    const {username, password, passwordRepeat} = this.state;
    if(!username) {
      return '用户名不能为空';
    }

    if(!/^[A-Za-z\d]{5,16}$/.test(username)) {
      return '用户名必须为5到16位英文或数字';
    }

    if(!password) {
      return '密码不能为空';
    }

    if(!/^[A-Za-z\d]{5,16}$/.test(password)) {
      return '密码必须为5到16位英文或数字';
    }

    if(password !== passwordRepeat) {
      return '重复密码不一致';
    }

    return '';
  }

  _handleRegister() {
    let err = this.checkInputErr();
    if(err) {
      showAlert(err);
    }else {
      this.props.dispatch(showLoading());
      let username = this.state.username;
      let password = this.state.password;
      this.props.dispatch(register(username, password, () => {
        this.props.dispatch(showAlert('注册成功'));
      }));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TLoading />
        <Text style={styles.title}>注册TRPG Game账户</Text>
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
        <TFormGroup
          label="重复密码"
          value={this.state.passwordRepeat}
          onChangeText={(passwordRepeat) => this.setState({passwordRepeat})}
          input={{
            placeholder: "请再次输入密码",
            secureTextEntry: true
          }}
        />
        <TButton
          style={styles.loginBtn}
          onPress={() => this._handleRegister()}
        >注册账户</TButton>
      </View>
    )
  }
}

const styles = {
  container: [
    // sb.alignCenter(),
    sb.flex(),
    sb.padding(20, 20, 0),
  ],
  title: [
    sb.textAlign('left'),
    sb.font(20),
    {paddingLeft: 10, marginBottom: 20}
  ],
}

module.exports = connect()(RegisterScreen);
