import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { findUser } from '../../../shared/redux/actions/user';
import ModalPanel from '../ModalPanel';
import FindResultItem from '../FindResultItem';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';

import './FriendsAdd.scss';

interface Props extends TRPGDispatchProp {
  isFinding: boolean;
  findingResult: any;
}
class FriendsAdd extends React.Component<Props> {
  state = {
    selectValue: 'username',
    searchText: '',
  };

  handleSearch() {
    const text = this.state.searchText.trim();
    const type = this.state.selectValue;
    if (!!text) {
      this.props.dispatch(findUser(text, type));
    } else {
      console.log('搜索内容不能为空');
    }
  }

  getFriendResult(findingResult) {
    if (!findingResult) {
      findingResult = [];
    }

    return findingResult.map(function(item, index) {
      return <FindResultItem key={item.uuid + '#' + index} info={item} />;
    });
  }

  render() {
    const options = [
      { value: 'uuid', label: '用户唯一标示符' },
      { value: 'username', label: '用户名' },
      { value: 'nickname', label: '昵称' },
    ];
    return (
      <ModalPanel title="添加好友">
        <div className="friends-add">
          <div className="friends-search">
            <input
              type="text"
              placeholder="请输入你要添加的好友信息"
              spellCheck={false}
              value={this.state.searchText}
              onChange={(e) => this.setState({ searchText: e.target.value })}
            />
            <div className="friends-search-method">
              <Select
                name="form-field-name"
                value={this.state.selectValue}
                options={options}
                clearable={false}
                searchable={false}
                placeholder="请选择搜索方式..."
                onChange={(item) => this.setState({ selectValue: item.value })}
              />
            </div>
            <button onClick={() => this.handleSearch()}>搜索</button>
          </div>
          <div className="friends-search-result">
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
  isFinding: state.user.isFindingUser,
  findingResult: state.user.findingResult,
}))(FriendsAdd);
