import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { NavigationActions } from 'react-navigation';
import sb from 'react-native-style-block';
import styled from 'styled-components/native';
import config from '../../../config/project.config';
import appConfig from '../config.app';
import { logout } from '../../redux/actions/user';
import { openWebview } from '../redux/actions/nav';
import { TButton, TAvatar } from '../components/TComponent';
import checkVersion from '../../shared/utils/check-version';
import * as appUtils from '../../shared/utils/apputils';
import { TIcon } from '../components/TComponent';

import { List } from '@ant-design/react-native';
import { showToast } from '@src/redux/actions/ui';
const Item = List.Item;

const AccountList = styled(List)`
  margin-top: 10px;
`;

const AccountListThumb = styled(TIcon)<{ color: string }>`
  font-size: 22px;
  margin-right: 10px;
  color: ${(props) => props.color};
`;

type Props = DispatchProp<any> & {
  userInfo: any;
};

class AccountScreen extends React.Component<Props> {
  static navigationOptions = {
    tabBarLabel: '我',
    headerTitle: '我',
    tabBarIcon: ({ tintColor }) => (
      <Text style={{ fontFamily: 'iconfont', fontSize: 26, color: tintColor }}>
        &#xe60d;
      </Text>
    ),
  };

  handleModifyProfile() {
    this.props.dispatch(
      NavigationActions.navigate({ routeName: 'ProfileModify' })
    );
  }

  handleLogout() {
    this.props.dispatch(logout());
  }

  render() {
    const userInfo = this.props.userInfo;
    let avatar = userInfo.get('avatar') || appConfig.defaultImg.user;
    let name = userInfo.get('nickname') || userInfo.get('username');
    return (
      <View>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => this.handleModifyProfile()}
        >
          <TAvatar
            uri={avatar}
            style={styles.avatar}
            name={name}
            height={60}
            width={60}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.username}>{name}</Text>
            <Text style={styles.userdesc} numberOfLines={1}>
              {userInfo.get('sign')}
            </Text>
          </View>
          <Text style={styles.arrow}>&#xe60e;</Text>
        </TouchableOpacity>

        <AccountList>
          <Item
            thumb={<AccountListThumb color="cornflowerblue" icon="&#xe60b;" />}
            arrow="horizontal"
            onPress={() => {
              this.props.dispatch(openWebview(config.url.goddessfantasy));
            }}
          >
            发现
          </Item>
          <Item
            thumb={<AccountListThumb color="gold" icon="&#xe609;" />}
            arrow="horizontal"
            onPress={() => {
              this.props.dispatch(
                NavigationActions.navigate({ routeName: 'Settings' })
              );
            }}
          >
            设置
          </Item>
        </AccountList>

        <AccountList>
          <Item
            arrow="horizontal"
            extra={config.version}
            onPress={() => {
              this.props.dispatch(
                NavigationActions.navigate({ routeName: 'Version' })
              );
            }}
          >
            当前版本
          </Item>
        </AccountList>

        <TButton
          type="error"
          style={styles.logoutBtn}
          textStyle={{ color: 'white' } as any}
          onPress={() => this.handleLogout()}
        >
          退出
        </TButton>
      </View>
    );
  }
}

const styles = {
  logoutBtn: [sb.margin(10)],
  userInfo: [
    sb.direction(),
    sb.bgColor(),
    sb.border('Top', 0.5, '#ccc'),
    sb.border('Bottom', 0.5, '#ccc'),
    sb.margin(14, 0),
    sb.padding(4, 8),
    sb.alignCenter(),
    { height: 80 },
  ],
  avatar: [sb.radius(30), { marginRight: 10 }],
  username: [sb.font(18)],
  userdesc: [sb.color('#999')],
  arrow: [
    { fontFamily: 'iconfont', marginRight: 6 },
    sb.font(18),
    sb.color('#ccc'),
  ],
};

export default connect((state: any) => ({
  userInfo: state.getIn(['user', 'info']),
}))(AccountScreen);
