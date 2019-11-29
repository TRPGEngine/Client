import React from 'react';
import { fetchActorList, ActorItem } from '@portal/model/actor';
import styled from 'styled-components';
import Avatar from '@web/components/Avatar';
import { Checkbox } from 'antd';
import _pull from 'lodash/pull';
import _clone from 'lodash/clone';
import _isFunction from 'lodash/isFunction';

const ActorListItem = styled.div`
  padding: 10px;
  display: flex;
  border-bottom: ${(props) => props.theme.border.thin};

  div {
    flex: 1;
  }
`;

const ActorListItemCheckbox = styled(Checkbox)`
  margin-right: 4px !important;
`;

/**
 * 角色选择器
 */
interface Props {
  value: string[];
  multiple?: boolean;
  onChange?: (uuid: string[]) => void;
}
interface State {
  actors: ActorItem[];
}
class ActorSelect extends React.Component<Props, State> {
  static defaultProps = {
    value: [],
    multiple: false,
  };

  state: State = {
    actors: [],
  };

  async componentDidMount() {
    const actors = await fetchActorList();
    this.setState({ actors });
  }

  handleSelectActor = (uuid: string) => {
    const { value, onChange, multiple } = this.props;
    let newVal = _clone(value);
    if (newVal.includes(uuid)) {
      // 已存在
      _pull(newVal, uuid);
    } else {
      // 不存在
      if (multiple === true) {
        newVal.push(uuid);
      } else {
        newVal = [uuid];
      }
    }

    _isFunction(onChange) && onChange(newVal);
  };

  render() {
    return this.state.actors.map((item) => (
      <ActorListItem
        key={item.uuid}
        onClick={() => this.handleSelectActor(item.uuid)}
      >
        <ActorListItemCheckbox checked={this.props.value.includes(item.uuid)} />
        <div>
          <div>
            <strong>{item.name}</strong>
          </div>
          <div>{item.desc}</div>
        </div>
        <Avatar name={item.name} src={item.avatar} />
      </ActorListItem>
    ));
  }
}

export default ActorSelect;
