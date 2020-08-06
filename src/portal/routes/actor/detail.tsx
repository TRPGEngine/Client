import React from 'react';
import { RouteComponentProps } from 'react-router';
import { fetchActorAccess, removeActor } from '@portal/model/actor';
import { ActionButton } from '@portal/components/ActionButton';
import _get from 'lodash/get';
import history from '@portal/history';
import ActorEditor from '@portal/components/ActorEditor';
import { notification, Modal } from 'antd';

interface Props
  extends RouteComponentProps<{
    actorUUID: string;
  }> {}

class ActorDetail extends React.Component<Props> {
  state = {
    actorAccess: {},
  };

  get actorUUID(): string {
    return this.props.match.params.actorUUID;
  }

  async componentDidMount() {
    const access = await fetchActorAccess(this.actorUUID);

    this.setState({
      actorAccess: access,
    });
  }

  handleEditActor = () => {
    history.push(`/actor/edit/${this.actorUUID}`);
  };

  handleRemoveActor = () => {
    Modal.warning({
      content: '你确定要删除该人物卡么？删除后人物卡将永远无法找回',
      maskClosable: true,
      onOk: () => {
        removeActor(this.actorUUID)
          .then(() => {
            notification.open({
              message: '删除成功, 1秒后自动跳转',
            });
            setTimeout(() => history.replace(`/actor/list`), 1000);
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
    const { actorAccess } = this.state;

    return (
      <ActorEditor uuid={this.actorUUID} type="detail">
        {_get(actorAccess, 'editable') === true ? (
          <ActionButton type="primary" onClick={this.handleEditActor}>
            编辑
          </ActionButton>
        ) : null}
        {_get(actorAccess, 'removeable') === true ? (
          <ActionButton
            type="primary"
            danger={true}
            onClick={this.handleRemoveActor}
          >
            删除
          </ActionButton>
        ) : null}
      </ActorEditor>
    );
  }
}

export default ActorDetail;
