import React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  fetchGroupActorList,
  GroupActorItem,
  applyGroupActor,
} from '@portal/model/group';
import styled from 'styled-components';
import _isEmpty from 'lodash/isEmpty';
import _head from 'lodash/head';
import Loading from '@portal/components/Loading';
import Avatar from '@web/components/Avatar';
import { ActionButton } from '@portal/components/ActionButton';
import { Modal, notification } from 'antd';
import ActorSelect from '@portal/components/ActorSelect';

const GroupActorListItem = styled.div<{
  passed: boolean;
  enabled: boolean;
}>`
  padding: 10px;
  display: flex;
  border-bottom: ${(props) => props.theme.border.thin};
  border-left: 3px solid
    ${(props) =>
      props.passed
        ? props.theme.color.antd.green.primary
        : props.theme.color.antd.yellow.primary};

  ${(props) =>
    !props.enabled ? `filter: ${props.theme.filter.grey100};opacity: 0.4;` : ''}

  div:first-child {
    flex: 1;
  }
`;

interface Props
  extends RouteComponentProps<{
    groupUUID: string;
  }> {}
interface State {
  actors: GroupActorItem[];
  applyActorModalVisible: boolean; // 是否显示申请团角色模态框
  selectedActorUUID: string[]; // 选择的角色的UUID
}
class GroupActorList extends React.Component<Props, State> {
  state: Readonly<State> = {
    actors: [],
    applyActorModalVisible: false,
    selectedActorUUID: [],
  };

  get groupUUID() {
    return this.props.match.params.groupUUID;
  }

  componentDidMount() {
    this.fetchList();
  }

  async fetchList() {
    const actors = await fetchGroupActorList(this.groupUUID);
    this.setState({ actors });
  }

  /**
   * 点击详情
   */
  handleClick = (groupActorUUID: string) => {
    // TODO
    console.log('groupActorUUID', groupActorUUID);
  };

  /**
   * 申请团角色
   */
  handleApplyActor = async () => {
    try {
      const actorUUID = _head(this.state.selectedActorUUID);
      const groupActor = await applyGroupActor(this.groupUUID, actorUUID);

      this.setState({
        applyActorModalVisible: false,
      });

      this.fetchList();
      notification.open({
        message: `申请成功, 请等待团管理员审批: ${groupActor.uuid}`,
      });
    } catch (err) {
      notification.error({
        message: err,
      });
    }
  };

  renderApplyActorModal() {
    return (
      <Modal
        title="选择角色"
        visible={this.state.applyActorModalVisible}
        onOk={this.handleApplyActor}
        onCancel={() =>
          this.setState({
            applyActorModalVisible: false,
          })
        }
      >
        <ActorSelect
          value={this.state.selectedActorUUID}
          onChange={(uuids) => this.setState({ selectedActorUUID: uuids })}
        />
      </Modal>
    );
  }

  renderList() {
    const { actors } = this.state;

    if (_isEmpty(actors)) {
      return <Loading />;
    }

    return actors.map((actor) => (
      <GroupActorListItem
        key={actor.uuid}
        passed={actor.passed}
        enabled={actor.enabled}
        onClick={() => this.handleClick(actor.uuid)}
      >
        <div>
          <div>
            <strong>{actor.name}</strong>
          </div>
          <div>{actor.desc}</div>
        </div>
        <Avatar name={actor.name} src={actor.avatar} />
      </GroupActorListItem>
    ));
  }

  render() {
    return (
      <div>
        {this.renderList()}
        <ActionButton
          type="primary"
          onClick={() => this.setState({ applyActorModalVisible: true })}
        >
          申请添加角色
        </ActionButton>
        {this.renderApplyActorModal()}
      </div>
    );
  }
}

export default GroupActorList;
