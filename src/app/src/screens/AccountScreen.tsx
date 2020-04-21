import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import sb from 'react-native-style-block';
import styled from 'styled-components/native';
import config from '../../../shared/project.config';
import appConfig from '@app/config.app';
import { logout } from '../../../shared/redux/actions/user';
import { openWebview, switchNav, navPortal } from '../redux/actions/nav';
import { TButton, TAvatar } from '../components/TComponent';
import { TIcon } from '../components/TComponent';
import DevContainer from '../components/DevContainer';

import { List } from '@ant-design/react-native';
import { TRPGState } from '@redux/types/__all__';
const Item = List.Item;

const AccountUserNameText = styled.Text`
  font-size: 18px;
`;

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
    const avatar = userInfo.avatar || appConfig.defaultImg.user;
    const name = userInfo.nickname || userInfo.username;

    return (
      <View>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => this.handleModifyProfile()}
        >
          <TAvatar
            uri={avatar}
            style={{ marginRight: 10 }}
            name={name}
            height={60}
            width={60}
          />
          <View style={{ flex: 1 }}>
            <AccountUserNameText>{name}</AccountUserNameText>
            <Text style={styles.userdesc} numberOfLines={1}>
              {userInfo.sign}
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
          <DevContainer>
            <Item
              thumb={<AccountListThumb color="orangered" icon="&#xe623;" />}
              arrow="horizontal"
              onPress={() => {
                this.props.dispatch(switchNav('Document'));
              }}
            >
              资料库
            </Item>
          </DevContainer>
          <Item
            thumb={<AccountListThumb color="green" icon="&#xe61b;" />}
            arrow="horizontal"
            onPress={() => {
              this.props.dispatch(navPortal('/actor/list'));
            }}
          >
            人物卡
          </Item>
          <Item
            thumb={<AccountListThumb color="blueviolet" icon="&#xe624;" />}
            arrow="horizontal"
            onPress={() => {
              this.props.dispatch(navPortal('/trpg/report/list'));
            }}
          >
            战报
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
            onPress={() => {
              this.props.dispatch(
                NavigationActions.navigate({ routeName: 'About' })
              );
            }}
          >
            关于TRPG Engine
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
  userdesc: [sb.color('#999')],
  arrow: [
    { fontFamily: 'iconfont', marginRight: 6 },
    sb.font(18),
    sb.color('#ccc'),
  ],
};

export default connect((state: TRPGState) => ({
  userInfo: state.user.info,
}))(AccountScreen);
