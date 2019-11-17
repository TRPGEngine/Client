import React from 'react';
import styled from 'styled-components';
import { Button, Spin, Row, Avatar } from 'antd';
import { fetchActorList, ActorItem } from '@portal/model/actor';
import _isNull from 'lodash/isNull';
import _head from 'lodash/head';
import history from '@portal/history';
import { ActionButton } from '@portal/components/ActionButton';

const Container = styled.div`
  padding: 10px;
`;

const ActorListItem = styled.div`
  padding: 10px;
  display: flex;
  border-bottom: ${(props) => props.theme.border.thin};

  div {
    flex: 1;
  }
`;

interface State {
  list: ActorItem[];
}
class ActorList extends React.Component<{}, State> {
  state: Readonly<State> = {
    list: null,
  };

  componentDidMount() {
    fetchActorList().then((list) =>
      this.setState({
        list,
      })
    );
  }

  handleCreateActor = () => {
    history.push('/actor/create/select-template');
  };

  handleSelectActor = (uuid: string) => {
    alert('TODO:' + uuid);
  };

  renderList() {
    const { list } = this.state;

    if (_isNull(list)) {
      return (
        <Row type="flex" justify="center">
          <Spin />
        </Row>
      );
    }

    return list.map((item) => (
      <ActorListItem
        key={item.uuid}
        onClick={() => this.handleSelectActor(item.uuid)}
      >
        <div>
          <div>
            <strong>{item.name}</strong>
          </div>
          <div>{item.desc}</div>
        </div>
        <Avatar src={item.avatar}>{_head(item.name)}</Avatar>
      </ActorListItem>
    ));
  }

  render() {
    return (
      <Container>
        <ActionButton onClick={this.handleCreateActor}>创建人物卡</ActionButton>
        <div>{this.renderList()}</div>
      </Container>
    );
  }
}

export default ActorList;
