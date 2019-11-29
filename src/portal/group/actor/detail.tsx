import React from 'react';
import { RouteComponentProps } from 'react-router';
import ActorEditor from '@portal/components/ActorEditor';
import { fetchGroupActorAccess } from '@portal/model/group';
import { ModelAccess } from '@portal/model/types';
import _get from 'lodash/get';
import { ActionButton } from '@portal/components/ActionButton';
import { nav } from '@portal/history';

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

  render() {
    const { access } = this.state;

    return (
      <ActorEditor uuid={this.groupActorUUID} type="detail" isGroupActor={true}>
        {_get(access, 'editable') === true ? (
          <ActionButton type="primary" onClick={this.handleEditGroupActor}>
            编辑
          </ActionButton>
        ) : null}
      </ActorEditor>
    );
  }
}

export default GroupActorDetail;
