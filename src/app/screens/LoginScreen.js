const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  Button,
} = require('react-native');
const TFormGroup = require('../components/TFormGroup');
const sb = require('react-native-style-block');

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Text style={{fontFamily:'iconfont', fontSize: 26, color: tintColor}}>&#xe958;</Text>
    ),
  };

  render() {
    console.log('TFormGroup', TFormGroup);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>欢迎来到TRPG Game</Text>
        <TFormGroup
          label="用户名"
          input={{
            placeholder: "请输入用户名",
          }}
        />
        <TFormGroup
          label="密码"
          input={{
            placeholder: "请输入密码",
            secureTextEntry: true
          }}
        />
        <Button
          title="登录"
          onPress={() => {}} 
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
