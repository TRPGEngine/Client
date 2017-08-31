const React = require('react');
const { connect } = require('react-redux');
const Select = require('react-select');
const { findUser } = require('../../../redux/actions/user');

require('react-select/dist/react-select.css');
require('./FriendsDetail.scss');

class FriendsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: 'uuid',
      searchText: '',
    }
  }

  _handleSearch() {
    let text = this.state.searchText.trim();
    let type = this.state.selectValue;
    this.props.dispatch(findUser(text, type));
  }

  render() {
    let options = [
      { value: 'uuid', label: '用户唯一标示符' },
      { value: 'username', label: '用户名' }
    ];
    return (
      <div className="friends-detail">
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
          结果
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({

  })
)(FriendsDetail);
