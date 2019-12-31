import React from 'react';
import { RouteComponentProps } from 'react-router';
import { ActionButton } from '@portal/components/ActionButton';
import ActorEditor from '@portal/components/ActorEditor';
import { checkToken } from '@portal/utils/auth';
import { editActor } from '@portal/model/actor';
import history from '@portal/history';
import { notification } from 'antd';

interface Props
  extends RouteComponentProps<{
    actorUUID: string;
  }> {}
class ActorEdit extends React.Component<Props> {
  state = {
    data: {},
  };

  get actorUUID(): string {
    return this.props.match.params.actorUUID;
  }

  async componentDidMount() {
    await checkToken();
  }

  handleSave = () => {
    const actorUUID = this.actorUUID;
    editActor(actorUUID, this.state.data)
      .then(() => {
        notification.open({
          message: '编辑成功, 1秒后自动跳转',
        });
        setTimeout(() => history.replace(`/actor/detail/${actorUUID}`), 1000);
      })
      .catch((err) => {
        notification.error({
          message: '编辑失败: ' + err,
        });
      });
  };

  render() {
    return (
      <ActorEditor
        uuid={this.actorUUID}
        type="edit"
        onChange={(data) => this.setState({ data })}
      >
        <ActionButton type="primary" onClick={this.handleSave}>
          保存
        </ActionButton>
      </ActorEditor>
    );
  }
}

export default ActorEdit;
