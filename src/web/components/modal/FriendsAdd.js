const React = require('react');
const { connect } = require('react-redux');
const Select = require('react-select');
const { findUser } = require('../../../redux/actions/user');
const ModalPanel = require('../ModalPanel');
const FindResultItem = require('../FindResultItem');

require('./FriendsAdd.scss');

class FriendsAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: 'username',
      searchText: '',
    }
  }

  _handleSearch() {
    let text = this.state.searchText.trim();
    let type = this.state.selectValue;
    if(!!text) {
      this.props.dispatch(findUser(text, type));
    }else {
      console.log('搜索内容不能为空');
    }
  }

  getFriendResult(findingResult) {
    if(!findingResult) {
      findingResult = [];
    }

    return findingResult.map(function(item, index) {
      return (
        <FindResultItem key={item.uuid + '#' + index} info={item} />
      )
    });
  }

  render() {
    let options = [
      { value: 'uuid', label: '用户唯一标示符' },
      { value: 'username', label: '用户名' },
    ];
    return (
      <ModalPanel title="添加好友">
        <div className="friends-add">
          <div className="friends-search">
            <input
              type="text"
              placeholder="请输入你要添加的好友信息"
              spellCheck="false"
              value={this.state.searchText}
              onChange={(e) => this.setState({searchText: e.target.value})}
            />
            <div className="friends-search-method">
              <Select
                name="form-field-name"
                value={this.state.selectValue}
                options={options}
                clearable={false}
                searchable={false}
                placeholder="请选择搜索方式..."
                onChange={(item) => this.setState({selectValue: item.value})}
              />
            </div>
            <button onClick={() => this._handleSearch()}>搜索</button>
          </div>
          <div className="friends-search-result">
            {
              this.props.isFinding ? '正在查询...' : this.getFriendResult(this.props.findingResult.toJS())
            }
          </div>
        </div>
      </ModalPanel>
    )
  }
}

module.exports = connect(
  state => ({
    isFinding: state.getIn(['user', 'isFindingUser']),
    findingResult: state.getIn(['user', 'findingResult'])
  })
)(FriendsAdd);
