import React from 'react';
import { RouteComponentProps } from 'react-router';
import ActorEditor from '@portal/components/ActorEditor';
import { fetchGroupActorAccess, removeGroupActor } from '@portal/model/group';
import { ModelAccess } from '@portal/model/types';
import _get from 'lodash/get';
import { ActionButton } from '@portal/components/ActionButton';
import { nav } from '@portal/history';
import { Modal, notification } from 'antd';
import history from '@portal/history';

interface Props
  extends RouteComponentProps<{
    groupUUID: string;
    groupActorUUID: string;
  }> {}
interface State {
  access: ModelAccess;
}

class GroupActorDetail extends React.Component<Props, State> {
  state: State = {
    access: {},
  };

  get groupUUID(): string {
    return this.props.match.params.groupUUID;
  }

  get groupActorUUID(): string {
    return this.props.match.params.groupActorUUID;
  }

  componentDidMount() {
    fetchGroupActorAccess(this.groupUUID, this.groupActorUUID).then((access) =>
      this.setState({ access })
    );
  }

  handleEditGroupActor = () => {
    nav(`/group/${this.groupUUID}/actor/${this.groupActorUUID}/edit`);
  };

  handleRemoveGroupActor = () => {
    Modal.warning({
      content: '你确定要删除该人物卡么？删除后人物卡将永远无法找回',
      maskClosable: true,
      onOk: () => {
        removeGroupActor(this.groupUUID, this.groupActorUUID)
          .then(() => {
            notification.open({
              message: '删除成功, 1秒后自动跳转',
            });
            setTimeout(
              () => history.replace(`/group/${this.groupUUID}/actor/list`),
              1000
            );
          })
          .catch((err) =>
            notification.error({
              message: '删除失败: ' + err,
            })
          );
      },
    });
  };

  render() {
    const { access } = this.state;

    return (
      <ActorEditor uuid={this.groupActorUUID} type="detail" isGroupActor={true}>
        {_get(access, 'editable') === true ? (
          <ActionButton type="primary" onClick={this.handleEditGroupActor}>
            编辑
          </ActionButton>
        ) : null}
        {_get(access, 'removeable') === true ? (
          <ActionButton
            type="primary"
            danger={true}
            onClick={this.handleRemoveGroupActor}
          >
            删除
          </ActionButton>
        ) : null}
      </ActorEditor>
    );
  }
}

export default GroupActorDetail;
