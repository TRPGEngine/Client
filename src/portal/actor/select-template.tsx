import React from 'react';
import { fetchTemplateList, TemplateItem } from '@portal/model/actor';
import styled from 'styled-components';
import history from '@portal/history';

const TemplateListItem = styled.div`
  padding: 10px;
  border-bottom: ${(props) => props.theme.border.thin};
`;

interface State {
  list: TemplateItem[];
}

class ActorSelectTemplate extends React.Component<{}, State> {
  state: State = {
    list: [],
  };

  componentDidMount() {
    fetchTemplateList().then((list) =>
      this.setState({
        list,
      })
    );
  }

  handleClick = (uuid: string) => {
    history.push(`/actor/create/template/${uuid}`);
  };

  render() {
    const { list } = this.state;

    return (
      <div>
        {list.map((item) => (
          <TemplateListItem onClick={() => this.handleClick(item.uuid)}>
            {item.name}
          </TemplateListItem>
        ))}
      </div>
    );
  }
}

export default ActorSelectTemplate;
