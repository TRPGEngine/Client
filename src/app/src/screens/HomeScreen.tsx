import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { NavigationActions } from 'react-navigation';
import sb from 'react-native-style-block';
import dateHelper from '../../../shared/utils/date-helper';
import appConfig from '../config.app';
import ConvItem from '../components/ConvItem';
import {
  reloadConverseList,
  switchConverse,
} from '../../../shared/redux/actions/chat';
import styled from 'styled-components/native';
import { Spring } from 'react-spring/renderprops';

const NetworkContainer = styled.View<{
  isOnline: boolean;
  tryReconnect: boolean;
}>`
  position: absolute;
  top: -26px;
  left: 0;
  right: 0;
  height: 26px;
  background-color: ${({ isOnline, tryReconnect }) =>
    isOnline ? '#2ecc71' : tryReconnect ? '#f39c12' : '#c0392b'};
  color: white;
  align-items: center;
  justify-content: center;
`;

const NetworkText = styled.Text`
  color: white;
`;

interface Props extends DispatchProp<any> {
  converses: any;
  conversesDesc: any;
  groups: any;
  usercache: any;
  network: any;
}
class HomeScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: 'TRPG',
    // tabBarLabel: 'TRPG',
    tabBarIcon: ({ tintColor }) => (
      <Text style={{ fontFamily: 'iconfont', fontSize: 26, color: tintColor }}>
        &#xe648;
      </Text>
    ),
  };

  state = {
    isRefreshing: false,
  };

  getNetworkTip() {
    const { network } = this.props;
    return (
      <Spring to={{ top: network.get('isOnline') ? -26 : 0 }}>
        {(props) => (
          <NetworkContainer
            style={props}
            isOnline={network.get('isOnline')}
            tryReconnect={network.get('tryReconnect')}
          >
            <NetworkText>{network.get('msg')}</NetworkText>
          </NetworkContainer>
        )}
      </Spring>
    );
  }

  getList() {
    if (this.props.converses.size > 0) {
      const arr: any[] = this.props.converses
        .valueSeq()
        .sortBy((item) => new Date(item.get('lastTime') || 0))
        .reverse()
        .map((item, index) => {
          let uuid = item.get('uuid');
          let defaultIcon =
            uuid === 'trpgsystem'
              ? appConfig.defaultImg.trpgsystem
              : appConfig.defaultImg.user;
          let avatar: string;
          if (item.get('type') === 'user') {
            avatar = this.props.usercache.getIn([uuid, 'avatar']);
          } else if (item.get('type') === 'group') {
            let group = this.props.groups.find((g) => g.get('uuid') === uuid);
            avatar = group ? group.get('avatar') : '';
          }

          return {
            icon: item.get('icon') || avatar || defaultIcon,
            title: item.get('name'),
            content: item.get('lastMsg'),
            time: item.get('lastTime')
              ? dateHelper.getShortDiff(item.get('lastTime'))
              : '',
            uuid,
            unread: item.get('unread'),
            onPress: () => {
              this.handleSelectConverse(uuid, item.get('type'), item);
            },
          };
        })
        .toJS();

      return (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => this.handleRefresh()}
              colors={['#5dd3d2', '#ffaa4d', '#2f9bd7', '#f88756']}
              progressBackgroundColor="#ffffff"
              title="加载中..."
            />
          }
          keyExtractor={(item, index) => item.uuid}
          data={arr}
          renderItem={({ item }) => <ConvItem {...item} />}
        />
      );
    } else {
      return <Text style={styles.tipText}>{this.props.conversesDesc}</Text>;
    }
  }

  handleRefresh() {
    this.setState({ isRefreshing: true });
    var timer = setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 10000); //10秒后自动取消
    this.props.dispatch(
      reloadConverseList(() => {
        this.setState({ isRefreshing: false });
        clearTimeout(timer);
      })
    );
  }

  handleSelectConverse(uuid, type, info) {
    this.props.dispatch(switchConverse(uuid));
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'Chat',
        params: {
          uuid,
          type,
          name: info.get('name'),
        },
      })
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.getList()}
        {this.getNetworkTip()}
      </View>
    );
  }
}

const styles = {
  container: [sb.flex()],
  tipText: [sb.textAlign('center'), sb.margin(80, 0, 0, 0), sb.color('#999')],
};

export default connect((state: any) => ({
  converses: state.getIn(['chat', 'converses']),
  conversesDesc: state.getIn(['chat', 'conversesDesc']),
  groups: state.getIn(['group', 'groups']),
  usercache: state.getIn(['cache', 'user']),
  network: state.getIn(['ui', 'network']),
}))(HomeScreen);
