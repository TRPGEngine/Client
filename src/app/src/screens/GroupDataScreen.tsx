import React from 'react';
import { connect } from 'react-redux';
import { List, WingBlank, WhiteSpace } from '@ant-design/react-native';
import { View, Switch } from 'react-native';
import { TButton } from '../components/TComponent';
import { TRPGState, TRPGDispatchProp } from '@src/shared/redux/types/redux';
import {
  showAlert,
  hideAlert,
  hideSlidePanel,
} from '@src/shared/redux/actions/ui';
import { switchSelectGroup, quitGroup } from '@src/shared/redux/actions/group';
import { getCachedUserName } from '@src/shared/utils/cache-helper';
import _get from 'lodash/get';

const ListItem = List.Item;

interface Props extends TRPGDispatchProp {
  groupInfo: any;
}
class GroupDataScreen extends React.Component<Props> {
  state = {
    isMsgTop: false,
  };

  /**
   * 查看历史消息
   */
  handleViewHistory = () => {
    // TODO: 待实现
    alert('未实现');
  };

  /**
   * 切换选中角色
   */
  handleSelectGroupActor = () => {
    // TODO: 待实现
    alert('未实现');
  };

  /**
   * 切换是否消息置顶
   */
  handleSwitchMsgTop = (val: boolean) => {
    // TODO: 待实现
    this.setState({
      isMsgTop: val,
    });
  };

  /**
   * 退出团
   */
  handleQuitGroup = () => {
    const { dispatch, groupInfo } = this.props;

    dispatch(
      showAlert({
        title: '是否要退出群',
        content: '一旦确定无法撤销',
        onConfirm: () => {
          dispatch(hideAlert());
          let groupUUID = groupInfo.get('uuid');
          dispatch(switchSelectGroup(''));
          dispatch(quitGroup(groupUUID));
          dispatch(hideSlidePanel());
        },
      })
    );
  };

  render() {
    const { isMsgTop } = this.state;
    const { groupInfo } = this.props;

    const groupOwnerName = getCachedUserName(groupInfo.get('owner_uuid'));

    return (
      <View>
        <List renderHeader={'基本'}>
          <ListItem extra={groupOwnerName}>团主持人</ListItem>
          <ListItem extra={groupInfo.get('group_members').size + '人'}>
            团成员
          </ListItem>
          <ListItem onPress={this.handleViewHistory}>历史消息</ListItem>
        </List>
        <List renderHeader={'角色'}>
          <ListItem onPress={this.handleSelectGroupActor}>选择角色</ListItem>
        </List>
        <List renderHeader={'设置'}>
          <ListItem
            extra={
              <Switch
                value={isMsgTop}
                onValueChange={this.handleSwitchMsgTop}
              />
            }
          >
            消息置顶
          </ListItem>
          {/* <ListItem
            extra={
              <Switch
                value={isMsgTop}
                onValueChange={this.handleSwitchMsgTop}
              />
            }
          >
            免打扰
          </ListItem> */}
        </List>
        <WhiteSpace size="lg" />
        <WingBlank>
          <TButton type="error" onPress={this.handleQuitGroup}>
            退出本团
          </TButton>
        </WingBlank>
      </View>
    );
  }
}

export default connect((state: TRPGState, ownProps) => {
  const selectedGroupUUID = _get(ownProps, 'navigation.state.params.uuid', '');

  return {
    userUUID: state.getIn(['user', 'info', 'uuid']),
    usercache: state.getIn(['cache', 'user']),
    selectedGroupUUID,
    groupInfo: state
      .getIn(['group', 'groups'])
      .find((group) => group.get('uuid') === selectedGroupUUID),
  };
})(GroupDataScreen);
