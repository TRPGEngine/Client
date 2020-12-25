import React from 'react';
import { RouteComponentProps } from 'react-router';
import { checkToken } from '@portal/utils/auth';
import { fetchGroupActorAccess } from '@portal/model/group';
import { notification } from 'antd';
import { nav, navReplace } from '@portal/history';
import ActorEditor from '@portal/components/ActorEditor';
import { ActionButton } from '@portal/components/ActionButton';
import { handleError } from '@web/utils/error';
import { editGroupActor } from '@shared/model/group';

interface Props
  extends RouteComponentProps<{
    groupUUID: string;
    groupActorUUID: string;
  }> {}
class GroupActorEdit extends React.Component<Props> {
  state = {
    data: {},
  };

  get groupUUID(): string {
    return this.props.match.params.groupUUID;
  }

  get groupActorUUID(): string {
    return this.props.match.params.groupActorUUID;
  }

  componentDidMount() {
    // 检查权限
    checkToken();
    fetchGroupActorAccess(this.groupUUID, this.groupActorUUID).then(
      (access) => {
        if (access.editable !== true) {
          notification.warn({
            message: '没有编辑权限, 1秒后自动跳转到列表页',
          });
          setTimeout(() => {
            nav(`/group/${this.groupUUID}/actor/list`);
          }, 1000);
        }
      }
    );
  }

  handleSave = () => {
    editGroupActor(this.groupUUID, this.groupActorUUID, this.state.data)
      .then(() => {
        notification.open({
          message: '编辑成功, 1秒后自动跳转',
        });
        setTimeout(
          () =>
            navReplace(
              `/group/${this.groupUUID}/actor/${this.groupActorUUID}/detail`
            ),
          1000
        );
      })
      .catch((err) => {
        handleError(err, '编辑失败:');
      });
  };

  render() {
    return (
      <ActorEditor
        uuid={this.groupActorUUID}
        type="edit"
        onChange={(data) => this.setState({ data })}
        isGroupActor={true}
      >
        <ActionButton type="primary" onClick={this.handleSave}>
          保存
        </ActionButton>
      </ActorEditor>
    );
  }
}

export default GroupActorEdit;
