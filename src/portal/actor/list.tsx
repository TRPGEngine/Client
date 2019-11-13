import React from 'react';
import styled from 'styled-components';
import { Button, Spin, Row } from 'antd';
import { fetchActorList, ActorItem } from '@portal/model/actor';
import _isNull from 'lodash/isNull';
import history from '@portal/history';

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

  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    overflow: hidden;
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
      <ActorListItem onClick={() => this.handleSelectActor(item.uuid)}>
        <div>
          <div>
            <strong>{item.name}</strong>
          </div>
          <div>{item.desc}</div>
        </div>
        <img src={item.avatar} />
      </ActorListItem>
    ));
  }

  render() {
    return (
      <Container>
        <Button onClick={this.handleCreateActor}>创建人物卡</Button>
        <div>{this.renderList()}</div>
      </Container>
    );
  }
}

export default ActorList;
