import React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  fetchGroupActorList,
  GroupActorItem,
  applyGroupActor,
  agreeGroupActor,
  refuseGroupActor,
} from '@portal/model/group';
import styled from 'styled-components';
import _isEmpty from 'lodash/isEmpty';
import _head from 'lodash/head';
import Loading from '@portal/components/Loading';
import Avatar from '@web/components/Avatar';
import { ActionButton } from '@portal/components/ActionButton';
import { Modal, notification, Tabs } from 'antd';
import ActorSelect from '@portal/components/ActorSelect';
import GroupActorApprovalCard from '@portal/components/GroupActorApprovalCard';
import { nav } from '@portal/history';

const { TabPane } = Tabs;

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
  isLoading: boolean;
  actors: GroupActorItem[];
  applyActorModalVisible: boolean; // 是否显示申请团角色模态框
  selectedActorUUID: string[]; // 选择的角色的UUID
}
class GroupActorList extends React.Component<Props, State> {
  state: Readonly<State> = {
    isLoading: true,
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

  /**
   * 获取团人物卡列表
   */
  async fetchList() {
    try {
      this.setState({ isLoading: true });
      const actors = await fetchGroupActorList(this.groupUUID);

      this.setState({ actors });
    } catch (err) {
      notification.error({
        message: '获取列表失败: ' + err,
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  /**
   * 点击详情 跳转到团角色详情页面
   */
  handleClick = (groupActorUUID: string) => {
    nav(`/group/${this.groupUUID}/actor/${groupActorUUID}/detail`);
  };

  /**
   * 申请团角色
   */
  handleApplyActor = async () => {
    try {
      const actorUUID = _head(this.state.selectedActorUUID)!;
      const groupActor = await applyGroupActor(this.groupUUID, actorUUID);

      this.setState({
        applyActorModalVisible: false,
      });

      notification.open({
        message: `申请成功, 请等待团管理员审批: ${groupActor.uuid}`,
      });

      this.fetchList();
    } catch (err) {
      notification.error({
        message: err,
      });
    }
  };

  /**
   * 同意团角色
   */
  handleAgreeGroupActor = async (uuid: string) => {
    await agreeGroupActor(this.groupUUID, uuid)
      .then(() => {
        notification.success({
          message: '操作成功',
        });
        this.fetchList();
      })
      .catch((err) =>
        notification.error({
          message: '操作失败: ' + err,
        })
      );
  };

  /**
   * 拒绝团角色
   */
  handleRefuseGroupActor = async (uuid: string) => {
    await refuseGroupActor(this.groupUUID, uuid)
      .then(() => {
        notification.success({
          message: '操作成功',
        });
        this.fetchList();
      })
      .catch((err) =>
        notification.error({
          message: '操作失败: ' + err,
        })
      );
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
    const { isLoading, actors } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    return actors
      .filter((actor) => actor.passed)
      .map((actor) => (
        <GroupActorListItem
          key={actor.uuid}
          passed={actor.passed}
          enabled={actor.enabled}
          onClick={() => this.handleClick(actor.uuid)}
        >
          <div>
            <div>
              <strong>
                {actor.name} <small>({actor.owner?.name})</small>
              </strong>
            </div>
            <div>{actor.desc}</div>
          </div>
          <Avatar name={actor.name} src={actor.avatar} />
        </GroupActorListItem>
      ));
  }

  renderApprovalList() {
    const { actors } = this.state;

    if (_isEmpty(actors)) {
      return <Loading />;
    }

    return actors
      .filter((actor) => actor.passed === false && actor.enabled === true)
      .map((actor) => (
        <GroupActorApprovalCard
          key={actor.uuid}
          uuid={actor.uuid}
          name={actor.name}
          desc={actor.desc}
          avatar={actor.avatar}
          ownerName={actor.owner?.name}
          // TODO: 操作按钮应当仅团管理员可见
          onAgree={this.handleAgreeGroupActor}
          onRefuse={this.handleRefuseGroupActor}
        />
      ));
  }

  render() {
    return (
      <Tabs defaultActiveKey="actor">
        <TabPane tab="人物卡" key="actor">
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
        </TabPane>
        <TabPane tab="待审批" key="approval">
          {this.renderApprovalList()}
        </TabPane>
      </Tabs>
    );
  }
}

export default GroupActorList;
