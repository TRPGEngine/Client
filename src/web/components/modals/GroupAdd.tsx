import React from 'react';
import { connect } from 'react-redux';
import { findGroup } from '../../../shared/redux/actions/group';
import ModalPanel from '../ModalPanel';
import FindResultItem from '../FindResultItem';
import type { TRPGDispatchProp, TRPGState } from '@redux/types/__all__';
import { Select } from 'antd';

import './GroupAdd.scss';

interface Props extends TRPGDispatchProp {
  isFinding: boolean;
  findingResult: any;
}
class GroupAdd extends React.Component<Props> {
  state = {
    selectValue: 'groupname',
    searchText: '',
  };

  handleSearch() {
    const text = this.state.searchText.trim();
    const type = this.state.selectValue;
    if (!!text) {
      this.props.dispatch(findGroup(text, type));
    } else {
      console.log('搜索内容不能为空');
    }
  }

  getFriendResult(findingResult) {
    if (!findingResult) {
      findingResult = [];
    }

    return findingResult.map(function (item, index) {
      return (
        <FindResultItem
          key={item.uuid + '#' + index}
          info={item}
          type="group"
        />
      );
    });
  }

  render() {
    return (
      <ModalPanel title="添加团">
        <div className="group-add">
          <div className="group-search">
            <input
              type="text"
              placeholder="请输入你要添加的团信息"
              spellCheck={false}
              value={this.state.searchText}
              onChange={(e) => this.setState({ searchText: e.target.value })}
            />
            <div className="group-search-method">
              <Select
                style={{ width: '100%' }}
                size="large"
                value={this.state.selectValue}
                allowClear={false}
                placeholder="请选择搜索方式..."
                onChange={(value) => this.setState({ selectValue: value })}
              >
                <Select.Option value="uuid">团唯一标示符</Select.Option>
                <Select.Option value="groupname">团名称</Select.Option>
                <Select.Option value="groupdesc">团简介</Select.Option>
              </Select>
            </div>
            <button onClick={() => this.handleSearch()}>搜索</button>
          </div>
          <div className="group-search-result">
            {this.props.isFinding
              ? '正在查询...'
              : this.getFriendResult(this.props.findingResult)}
          </div>
        </div>
      </ModalPanel>
    );
  }
}

export default connect((state: TRPGState) => ({
  isFinding: state.group.isFindingGroup,
  findingResult: state.group.findingResult,
}))(GroupAdd);
