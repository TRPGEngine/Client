import React from 'react';
import { RouteComponentProps } from 'react-router';
import { fetchGroupActorList, GroupActorItem } from '@portal/model/group';
import styled from 'styled-components';
import _isEmpty from 'lodash/isEmpty';
import Loading from '@portal/components/Loading';
import Avatar from '@web/components/Avatar';

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
}
class GroupActorList extends React.Component<Props, State> {
  state: Readonly<State> = {
    actors: [],
  };

  get groupUUID() {
    return this.props.match.params.groupUUID;
  }

  async componentDidMount() {
    const actors = await fetchGroupActorList(this.groupUUID);
    this.setState({ actors });
  }

  handleClick = (groupActorUUID: string) => {
    console.log('groupActorUUID', groupActorUUID);
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
    return <div>{this.renderList()}</div>;
  }
}

export default GroupActorList;
