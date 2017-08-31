const React = require('react');
const { connect } = require('react-redux');
const Select = require('react-select');

require('react-select/dist/react-select.css');
require('./FriendsDetail.scss');

class FriendsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: 'uuid'
    }
  }

  render() {
    let options = [
      { value: 'uuid', label: '用户唯一标示符' },
      { value: 'username', label: '用户名' }
    ];
    return (
      <div className="friends-detail">
        <div className="friends-search">
          <input type="text" placeholder="请输入你要添加的好友信息" spellCheck="false" />
          <div className="friends-search-method">
            <Select
              name="form-field-name"
              value={this.state.selectValue}
              options={options}
              clearable={false}
              searchable={false}
              placeholder="请选择搜索方式..."
              onChange={(val) => this.setState({selectValue: val})}
            />
          </div>
          <button>搜索</button>
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
