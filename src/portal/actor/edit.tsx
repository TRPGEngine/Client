import React from 'react';
import { RouteComponentProps } from 'react-router';
import { ActionButton } from '@portal/components/ActionButton';
import ActorEditor from '@portal/components/ActorEditor';

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

  handleSave = () => {
    console.log(this.state.data);
  };

  render() {
    return (
      <ActorEditor
        actorUUID={this.actorUUID}
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
