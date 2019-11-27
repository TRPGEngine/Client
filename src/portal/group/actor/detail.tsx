import React from 'react';
import { RouteComponentProps } from 'react-router';
import ActorEditor from '@portal/components/ActorEditor';

interface Props
  extends RouteComponentProps<{
    groupUUID: string;
    groupActorUUID: string;
  }> {}

class GroupActorDetail extends React.Component<Props> {
  get groupUUID(): string {
    return this.props.match.params.groupUUID;
  }

  get groupActorUUID(): string {
    return this.props.match.params.groupActorUUID;
  }

  render() {
    return (
      <ActorEditor
        uuid={this.groupActorUUID}
        type="detail"
        isGroupActor={true}
      />
    );
  }
}

export default GroupActorDetail;
