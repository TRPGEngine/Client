const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  Image,
} = require('react-native');
const sb = require('react-native-style-block');
const appConfig = require('../config.app');

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let userUUID = this.props.navigation.state.params.uuid;
    let userInfo = this.props.usercache.get(userUUID);
    console.log(userInfo.toJS());
    let avatar = userInfo.get('avatar') ? {uri: userInfo.get('avatar')} : appConfig.defaultImg.user;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.avatar} source={avatar} />
          <Text style={{fontSize: 18, marginTop: 4}}>{userInfo.get('nickname') || userInfo.get('username')}</Text>
          <Text style={{fontSize: 12, color: '#999'}}>{userInfo.get('uuid')}</Text>
        </View>
        <View>
          
        </View>
      </View>
    )
  }
}

const styles = {
  container: [
    {flex: 1},
  ],
  header: [
    {marginBottom: 10},
    sb.alignCenter(),
    sb.bgColor('white'),
    sb.padding(20, 0),
  ],
  avatar: [
    sb.size(100, 100),
    sb.radius(50),
  ],
}

module.exports = connect(
  state => ({
    usercache: state.getIn(['cache', 'user']),
  })
)(ProfileScreen);
