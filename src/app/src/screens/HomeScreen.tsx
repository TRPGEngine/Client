import React from 'react';
import { connect } from 'react-redux';
import { View, Text, FlatList } from 'react-native';
import sb from 'react-native-style-block';
import dateHelper from '@shared/utils/date-helper';
import appConfig from '../config.app';
import ConvItem from '../components/ConvItem';
import { reloadConverseList } from '@shared/redux/actions/chat';
import styled from 'styled-components/native';
import TRefreshControl from '../components/TComponent/TRefreshControl';
import { ChatType } from '../types/params';
import type { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import _get from 'lodash/get';
import _values from 'lodash/values';
import _sortBy from 'lodash/sortBy';
import _size from 'lodash/size';
import { TMemo } from '@shared/components/TMemo';
import { useSpring, animated } from 'react-spring/native';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { TRPGTabScreenProps } from '@app/router';
import { switchToChatScreen } from '@app/navigate';

const NetworkContainer = styled(animated.View as any)<{
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

const NetworkTip: React.FC = TMemo((props) => {
  const network = useTRPGSelector((state) => state.ui.network);

  const style = useSpring({
    to: {
      top: network.isOnline ? -26 : 0,
    },
  });

  return (
    <NetworkContainer
      style={style}
      isOnline={network.isOnline}
      tryReconnect={network.tryReconnect}
    >
      <NetworkText>{network.msg}</NetworkText>
    </NetworkContainer>
  );
});
NetworkTip.displayName = 'NetworkTip';

interface Props extends TRPGDispatchProp, TRPGTabScreenProps<'TRPG'> {
  converses: any;
  conversesDesc: any;
  groups: any;
  usercache: any;
}
class HomeScreen extends React.Component<Props> {
  state = {
    isRefreshing: false,
  };

  getList() {
    if (_size(this.props.converses) > 0) {
      const arr: any[] = _sortBy(
        _values(this.props.converses),
        (item) => new Date(item.lastTime || 0)
      )
        .reverse()
        .map((item, index) => {
          const uuid = item.uuid;
          const defaultIcon =
            uuid === 'trpgsystem'
              ? appConfig.defaultImg.trpgsystem
              : appConfig.defaultImg.user;
          let avatar: string;
          if (item.type === 'user') {
            avatar = _get(this.props.usercache, [uuid, 'avatar']);
          } else if (item.type === 'group') {
            const group = this.props.groups.find((g) => g.uuid === uuid);
            avatar = group ? group.avatar : '';
          }

          return {
            icon: item.icon || avatar || defaultIcon,
            title: item.name,
            content: item.lastMsg,
            time: item.lastTime ? dateHelper.getShortDiff(item.lastTime) : '',
            uuid,
            unread: item.unread,
            onPress: () => {
              this.handleSelectConverse(uuid, item.type, item);
            },
          };
        });

      return (
        <FlatList
          refreshControl={
            <TRefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => this.handleRefresh()}
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
    const timer = setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 10000); // 10秒后自动取消
    this.props.dispatch(
      reloadConverseList(() => {
        this.setState({ isRefreshing: false });
        clearTimeout(timer);
      })
    );
  }

  handleSelectConverse(uuid: string, type: ChatType, info) {
    switchToChatScreen(
      this.props.navigation.dangerouslyGetParent(),
      uuid,
      type,
      info.name
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.getList()}
        <NetworkTip />
      </View>
    );
  }
}

const styles = {
  container: [sb.flex()],
  tipText: [sb.textAlign('center'), sb.margin(80, 0, 0, 0), sb.color('#999')],
};

export default connect((state: TRPGState) => ({
  converses: state.chat.converses,
  conversesDesc: state.chat.conversesDesc,
  groups: state.group.groups,
  usercache: state.cache.user,
}))(HomeScreen);
