import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import sb from 'react-native-style-block';
import { TButton, TFormGroup, TLoading } from '../components/TComponent';
import { showLoading, showAlert } from '../../redux/actions/ui';
import { register } from '../../redux/actions/user';

interface Props {
  dispatch: any;
}

interface State {
  username: string;
  password: string;
  passwordRepeat: string;
}

class RegisterScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordRepeat: '',
    };
  }

  checkInputErr() {
    const { username, password, passwordRepeat } = this.state;
    if (!username) {
      return '用户名不能为空';
    }

    if (!/^[A-Za-z\d]{5,16}$/.test(username)) {
      return '用户名必须为5到16位英文或数字';
    }

    if (!password) {
      return '密码不能为空';
    }

    if (!/^[A-Za-z\d]{5,16}$/.test(password)) {
      return '密码必须为5到16位英文或数字';
    }

    if (password !== passwordRepeat) {
      return '重复密码不一致';
    }

    return '';
  }

  _handleRegister() {
    let err = this.checkInputErr();
    if (err) {
      this.props.dispatch(
        showAlert({
          title: '格式错误',
          content: err,
        })
      );
    } else {
      this.props.dispatch(showLoading());
      let username = this.state.username;
      let password = this.state.password;
      this.props.dispatch(
        register(username, password, () => {
          this.props.dispatch(
            showAlert({
              content: '注册成功',
              onConfirm: () => {
                this.props.dispatch(NavigationActions.back());
              },
            })
          );
        })
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TFormGroup
          label="用户名"
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          input={{
            placeholder: '请输入用户名',
          }}
        />
        <TFormGroup
          label="密码"
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          input={{
            placeholder: '请输入密码',
            secureTextEntry: true,
          }}
        />
        <TFormGroup
          label="重复密码"
          value={this.state.passwordRepeat}
          onChangeText={(passwordRepeat) => this.setState({ passwordRepeat })}
          input={{
            placeholder: '请再次输入密码',
            secureTextEntry: true,
          }}
        />
        <TButton onPress={() => this._handleRegister()}>成为祭品</TButton>
      </View>
    );
  }
}

const styles = {
  container: [
    // sb.alignCenter(),
    sb.flex(),
    sb.padding(20, 20, 0),
  ],
};

export default connect()(RegisterScreen);
