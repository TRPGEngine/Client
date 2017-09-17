const React = require('react');
const { connect } = require('react-redux')
const { showModal } = require('../../../redux/actions/ui');
const Select = require('react-select');
const TemplateCell = require('../../../components/TemplateCell');

require('./TemplateCreate.scss');

class TemplateCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectFunc: 'value',
    }
  }

  _handleBack() {
    const ActorCreate = require('./ActorCreate');
    this.props.showModal(<ActorCreate />);
  }

  render()　{
    let options = [
      { value: 'value', label: '值' },
      { value: 'expression', label: '表达式' }
    ];
    return (
      <div className="template-create">
        <div className="profile-panel">
          <div className="header">
            <button onClick={() => this._handleBack()}>&lt;返回</button>
            <input placeholder="模板名" />
            <button>保存</button>
          </div>
          <div className="desc">
            <textarea placeholder="模板描述" rows="4" cols="60"></textarea>
          </div>
          <div className="property-list">
            <TemplateCell name="力量" value="20" />
            <TemplateCell name="敏捷" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
          </div>
        </div>
        <div className="inspect-panel">
          <div className="data">
            <span>属性名:</span>
            <input type="text" placeholder="属性名"/>
          </div>
          <div className="data">
            <span>是否所有人可见:</span>
            <input
              type="checkbox"
              onChange={(e) => console.log(e.target.checked)}
            />
          </div>
          <div className="data">
            <span>描述:</span>
            <textarea placeholder="属性描述" rows="3"></textarea>
          </div>
          <div className="data">
            <span>计算方式:</span>
            <Select
              name="func"
              className="func-select"
              value={this.state.selectFunc}
              options={options}
              clearable={false}
              searchable={false}
              placeholder="属性计算方式"
              onChange={(item) => this.setState({selectFunc: item.value})}
            />
          </div>
          <div className="data">
            <span>{this.state.selectFunc==="expression"?"表达式":"默认值"}:</span>
            <input type="text" />
          </div>
          <div className="actions">
            <button>重置</button>
            <button>保存</button>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    findingResult: state.getIn(['user', 'actor', 'findingResult']),
  }),
  dispatch => ({
    showModal: (body) => dispatch(showModal(body))
  })
)(TemplateCreate)
