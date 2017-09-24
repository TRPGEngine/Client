const React = require('react');
const { connect } = require('react-redux')
const { showModal } = require('../../../redux/actions/ui');
const Select = require('react-select');
const TemplateCell = require('../../../components/TemplateCell');
const at = require('trpg-actor-template');
const {
  setTemplate,
  createTemplate,
  updateTemplate,
} = require('../../../redux/actions/actor');

require('./TemplateCreate.scss');

class TemplateCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectFunc: 'value',
      name: '',
      desc: '',
      template: at.getInitTemplate(),
      inspectCell: undefined,
    }
  }

  _handleBack() {
    const ActorCreate = require('./ActorCreate');
    this.props.showModal(<ActorCreate />);
  }

  _handleSave() {
    let template = this.state.template;
    template.name = this.state.name;
    template.desc = this.state.desc;
    template.avatar = '';
    let info = at.stringify(template);
    let uuid = this.props.currentEditedTemplate.get('uuid');
    if(!uuid) {
      this.props.createTemplate(template.name, template.desc, template.avatar, info);
    }else {
      this.props.updateTemplate(uuid, template.name, template.desc, template.avatar, info);
    }

  }

  _handleEdit(item) {
    this.setState({inspectCell: item});
  }

  _handleRemove(item, index) {
    if(this.state.inspectCell === item) {
      this.setState({inspectCell: undefined});
    }
    this.state.template.table.splice(index, 1);
    this.setState({template: this.state.template});
  }

  getInspectPanel() {
    let inspectCell = this.state.inspectCell;
    let inspect;
    let options = [
      { value: 'value', label: '值' },
      { value: 'expression', label: '表达式' }
    ];

    if(!inspectCell) {
      inspect = (
        <div className="inspect-panel">
          选择属性进行编辑
        </div>
      )
    }else {
      inspect = (
        <div className="inspect-panel">
          <div className="data">
            <span>属性名:</span>
            <input
              type="text"
              placeholder="属性名"
              value={inspectCell.name}
              onChange={(e) => {
                inspectCell.name = e.target.value;
                this.setState({inspectCell: inspectCell});
              }}
            />
          </div>
          <div className="data">
            <span>是否所有人可见:</span>
            <input
              type="checkbox"
              checked={inspectCell.visibility}
              onChange={(e) => {
                inspectCell.visibility = e.target.checked;
                this.setState({inspectCell: inspectCell});
              }}
            />
          </div>
          <div className="data">
            <span>描述:</span>
            <textarea
              placeholder="属性描述"
              rows="3"
              value={inspectCell.desc || ""}
              onChange={(e) => {
                inspectCell.desc = e.target.value;
                this.setState({inspectCell: inspectCell});
              }}
            />
          </div>
          <div className="data">
            <span>计算方式:</span>
            <Select
              name="func"
              className="func-select"
              value={inspectCell.func}
              options={options}
              clearable={false}
              searchable={false}
              placeholder="属性计算方式"
              onChange={(item) => {
                inspectCell.func = item.value;
                this.setState({inspectCell: inspectCell});
              }}
            />
          </div>
          <div className="data">
            <span>{inspectCell.func==="expression"?"表达式":"默认值"}:</span>
            <input
              type="text"
              value={inspectCell.default}
              onChange={(e) => {
                inspectCell.default = e.target.value;
                this.setState({inspectCell: inspectCell});
              }}
            />
          </div>
          <div className="data">
            <span>测试值:</span>
            <input
              type="text"
              value={inspectCell.value}
              onChange={(e) => {
                inspectCell.value = e.target.value;
                this.setState({inspectCell: inspectCell});
              }}
            />
          </div>
          {/*<div className="actions">
            <button>重置</button>
            <button>保存</button>
          </div>*/}
        </div>
      )
    }

    return inspect;
  }

  render()　{
    return (
      <div className="template-create">
        <div className="profile-panel">
          <div className="header">
            <button onClick={() => this._handleBack()}>&lt;返回</button>
            <input
              placeholder="模板名"
              value={this.state.name}
              onChange={(e) => this.setState({name: e.target.value})} />
            <button onClick={() => this._handleSave()}>保存</button>
          </div>
          <div className="desc">
            <textarea
              placeholder="模板描述"
              rows="4"
              cols="60"
              value={this.state.desc}
              onChange={(e) => this.setState({desc: e.target.value})}
            />
          </div>
          <div className="actions">
            <button onClick={() => {
              let newCell = at.getInitCell();
              this.state.template.insertCell(newCell);
              this.setState({template: this.state.template});
            }}>
              <i className="iconfont">&#xe604;</i>添加新属性
            </button>
          </div>
          <div className="property-list">
            {
              this.state.template.table.map((item, index) => {
                return (
                  <TemplateCell
                    key={"template-cell-"+index}
                    isActive={item===this.state.inspectCell}
                    name={item.name}
                    value={item.default}
                    onEdit={() => this._handleEdit(item)}
                    onRemove={() => this._handleRemove(item, index)} />
                )
              })
            }
          </div>
        </div>
        { this.getInspectPanel() }
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    currentEditedTemplate: state.getIn(['actor', 'currentEditedTemplate'])
  }),
  dispatch => ({
    showModal: (body) => dispatch(showModal(body)),
    createTemplate: (name, desc, avatar, info) => dispatch(createTemplate(name, desc, avatar, info)),
    updateTemplate: (uuid, name, desc, avatar, info) => dispatch(updateTemplate(uuid, name, desc, avatar, info)),
  })
)(TemplateCreate)
