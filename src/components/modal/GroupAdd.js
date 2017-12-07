const React = require('react');
const { connect } = require('react-redux');
const Select = require('react-select');
const { findGroup } = require('../../redux/actions/group');
const ModalPanel = require('../ModalPanel');
const FindResultItem = require('../FindResultItem');

require('./GroupAdd.scss');

class GroupAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: 'groupname',
      searchText: '',
    }
  }

  _handleSearch() {
    let text = this.state.searchText.trim();
    let type = this.state.selectValue;
    if(!!text) {
      this.props.dispatch(findGroup(text, type));
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
        <FindResultItem key={item.uuid + '#' + index} info={item} type="group" />
      )
    });
  }

  render() {
    let options = [
      { value: 'uuid', label: '团唯一标示符' },
      { value: 'groupname', label: '团名称' },
      { value: 'groupdesc', label: '团简介' },
    ];
    return (
      <ModalPanel title="添加团">
        <div className="group-add">
          <div className="group-search">
            <input
              type="text"
              placeholder="请输入你要添加的团信息"
              spellCheck="false"
              value={this.state.searchText}
              onChange={(e) => this.setState({searchText: e.target.value})}
            />
            <div className="group-search-method">
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
          <div className="group-search-result">
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
    isFinding: state.getIn(['group', 'isFindingGroup']),
    findingResult: state.getIn(['group', 'findingResult']),
  })
)(GroupAdd);
