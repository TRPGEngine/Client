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
  showModal,
  hideModal,
} from '@src/shared/redux/actions/ui';
import {
  switchSelectGroup,
  quitGroup,
  changeSelectGroupActor,
  dismissGroup,
} from '@src/shared/redux/actions/group';
import { getCachedUserName } from '@src/shared/utils/cache-helper';
import _get from 'lodash/get';
import _without from 'lodash/without';
import TModalPanel from '../components/TComponent/TModalPanel';
import TPicker from '../components/TComponent/TPicker';
import { selectUser } from '../redux/actions/nav';
import { GroupStateGroupsItem } from '@src/shared/redux/types/group';
import { Map } from 'immutable';

const ListItem = List.Item;

interface Props extends TRPGDispatchProp {
  userUUID: string;
  groupInfo: GroupStateGroupsItem;
  selfGroupActors: any;
  selectedGroupActorUUID: string;
  selectedGroupUUID: string;
  friendList: string[];
}
class GroupDataScreen extends React.Component<Props> {
  state = {
    isMsgTop: false,
  };

  get isGroupOwner(): boolean {
    const { userUUID, groupInfo } = this.props;
    return userUUID === groupInfo.get('owner_uuid');
  }

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
    const {
      dispatch,
      selectedGroupUUID,
      selfGroupActors,
      selectedGroupActorUUID,
    } = this.props;
    let actorUUID = selectedGroupActorUUID;

    let options = [];
    if (selfGroupActors && selfGroupActors.size > 0) {
      options = selfGroupActors
        .map((item, index) => ({
          value: item.get('uuid'),
          label: item.getIn(['actor', 'name']),
        }))
        .toJS();
    }
    if (selectedGroupActorUUID) {
      options.unshift({
        value: null,
        label: '取消选择',
      });
    }

    dispatch(
      showModal(
        <TModalPanel
          onOk={() => {
            dispatch(changeSelectGroupActor(selectedGroupUUID, actorUUID));
            dispatch(hideModal());
          }}
        >
          <TPicker
            items={options}
            defaultValue={actorUUID}
            onValueChange={(val) => (actorUUID = val)}
          />
        </TModalPanel>
      )
    );
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

  handleGroupInvite = () => {
    // 选择好友
    const { friendList, groupInfo } = this.props;
    const groupMembersList: string[] = groupInfo.get('group_members').toJS();
    const groupManagerList: string[] = groupInfo.get('managers_uuid').toJS();

    const target = _without(
      friendList,
      ...groupMembersList,
      ...groupManagerList
    );

    this.props.dispatch(
      selectUser(target, (uuids) => {
        alert(uuids.join(','));
      })
    );
  };

  /**
   * 退出团
   */
  handleQuitGroup = () => {
    const { dispatch, groupInfo } = this.props;

    if (this.isGroupOwner) {
      // 解散团
      dispatch(
        showAlert({
          title: '是否要解散群',
          content: '一旦确定无法撤销',
          onConfirm: () => {
            dispatch(hideAlert());
            let groupUUID = groupInfo.get('uuid');
            dispatch(switchSelectGroup(''));
            dispatch(dismissGroup(groupUUID));
            dispatch(hideSlidePanel());
          },
        })
      );
    } else {
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
    }
  };

  render() {
    const { isMsgTop } = this.state;
    const { groupInfo } = this.props;

    const groupOwnerName = getCachedUserName(groupInfo.get('owner_uuid'));

    return (
      <View>
        <List renderHeader={'基本'}>
          <ListItem extra={groupOwnerName}>团主持人</ListItem>
          <ListItem extra={groupInfo.get('managers_uuid').size + '人'}>
            团管理
          </ListItem>
          <ListItem extra={groupInfo.get('group_members').size + '人'}>
            团成员
          </ListItem>
          <ListItem extra={groupInfo.get('group_actors').size + '张'}>
            团人物卡
          </ListItem>
          <ListItem extra={groupInfo.get('maps_uuid').size + '张'}>
            团地图
          </ListItem>
          <ListItem multipleLine extra={groupInfo.get('desc')}>
            简介
          </ListItem>

          {/* <ListItem onPress={this.handleViewHistory} arrow="horizontal">
            历史消息
          </ListItem> */}
        </List>
        <List renderHeader={'成员'}>
          <ListItem onPress={this.handleGroupInvite} arrow="horizontal">
            邀请好友
          </ListItem>
        </List>
        <List renderHeader={'角色'}>
          <ListItem onPress={this.handleSelectGroupActor} arrow="horizontal">
            选择角色
          </ListItem>
        </List>
        {/* <List renderHeader={'设置'}>
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
          <ListItem
            extra={
              <Switch
                value={isMsgTop}
                onValueChange={this.handleSwitchMsgTop}
              />
            }
          >
            免打扰
          </ListItem>
        </List> */}
        <WhiteSpace size="lg" />
        <WingBlank>
          <TButton type="error" onPress={this.handleQuitGroup}>
            {this.isGroupOwner ? '解散本团' : '退出本团'}
          </TButton>
        </WingBlank>
      </View>
    );
  }
}

export default connect((state: TRPGState, ownProps) => {
  const selectedGroupUUID = _get(ownProps, 'navigation.state.params.uuid', '');

  const groupInfo =
    state
      .getIn(['group', 'groups'])
      .find((group) => group.get('uuid') === selectedGroupUUID) || Map();

  const selfActors = state
    .getIn(['actor', 'selfActors'])
    .map((i) => i.get('uuid'));

  const selfGroupActors = groupInfo
    .get('group_actors', [])
    .filter(
      (i) => i.get('enabled') && selfActors.indexOf(i.get('actor_uuid')) >= 0
    );

  const selectedGroupActorUUID = groupInfo.getIn([
    'extra',
    'selected_group_actor_uuid',
  ]);

  return {
    userUUID: state.getIn(['user', 'info', 'uuid']),
    usercache: state.getIn(['cache', 'user']),
    selectedGroupUUID,
    selfGroupActors,
    selectedGroupActorUUID,
    groupInfo,
    friendList: state.getIn(['user', 'friendList']).toJS(),
  };
})(GroupDataScreen);
