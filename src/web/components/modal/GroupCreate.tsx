import React from 'react';
import { connect } from 'react-redux';
import ModalPanel from '../ModalPanel';
import { createGroup } from '../../../shared/redux/actions/group';

import './GroupCreate.scss';
import { TRPGDispatchProp } from '@redux/types/__all__';

interface Props extends TRPGDispatchProp {}
class GroupCreate extends React.Component<Props> {
  state = {
    groupName: '',
    groupSubName: '',
    groupDesc: '',
  };

  handleCreate() {
    this.props.dispatch(
      createGroup(
        this.state.groupName,
        this.state.groupSubName,
        this.state.groupDesc
      )
    );
  }

  render() {
    let actions = (
      <div>
        <button onClick={() => this.handleCreate()}>创建</button>
      </div>
    );
    return (
      <ModalPanel title="创建团" actions={actions}>
        <div className="group-create">
          <div>
            <label>团名</label>
            <input
              type="text"
              maxLength={16}
              value={this.state.groupName}
              onChange={(e) => this.setState({ groupName: e.target.value })}
            />
          </div>
          <div>
            <label>团副名</label>
            <input
              type="text"
              placeholder="选填"
              maxLength={32}
              value={this.state.groupSubName}
              onChange={(e) => this.setState({ groupSubName: e.target.value })}
            />
          </div>
          <div>
            <label>团简介</label>
            <textarea
              placeholder="简单介绍下你的团吧"
              maxLength={100}
              rows={4}
              value={this.state.groupDesc}
              onChange={(e) => this.setState({ groupDesc: e.target.value })}
            />
          </div>
        </div>
      </ModalPanel>
    );
  }
}

export default connect()(GroupCreate);
