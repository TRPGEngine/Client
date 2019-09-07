import React from 'react';
import { connect } from 'react-redux';
import { showModal, showAlert, hideAlert } from '../../../../shared/redux/actions/ui';
import Select from 'react-select';
import TemplatePropertyCell from '../../../components/TemplatePropertyCell';
import at from 'trpg-actor-template';
import {
  createTemplate,
  updateTemplate,
} from '../../../../shared/redux/actions/actor';
import TemplateSelect from './TemplateSelect';
import TemplateAdvancedCreate from './TemplateAdvancedCreate';

import './TemplateEdit.scss';

class TemplateEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectFunc: 'value',
      name: '',
      desc: '',
      inspectCell: undefined,
    };
    if (this.props.isEdit && this.props.currentEditedTemplate.get('uuid')) {
      // 编辑模板
      this.state.template = at.parse(
        this.props.currentEditedTemplate.get('info')
      );
      this.state.name = this.props.currentEditedTemplate.get('name');
      this.state.desc = this.props.currentEditedTemplate.get('desc');
    } else {
      // 新建模板
      this.state.template = at.getInitTemplate();
    }
  }

  handleBack() {
    this.props.showModal(<TemplateSelect />);
  }

  handleSave() {
    let template = this.state.template;
    template.name = this.state.name;
    template.desc = this.state.desc;
    template.avatar = '';
    let info = at.stringify(template);
    let uuid = this.props.currentEditedTemplate.get('uuid');
    if (!uuid) {
      this.props.createTemplate(
        template.name,
        template.desc,
        template.avatar,
        info
      );
    } else {
      this.props.updateTemplate(
        uuid,
        template.name,
        template.desc,
        template.avatar,
        info
      );
    }
  }

  handleEdit(item) {
    this.setState({ inspectCell: item });
  }

  handleRemove(item, index) {
    if (this.state.inspectCell === item) {
      this.setState({ inspectCell: undefined });
    }
    this.state.template.table.splice(index, 1);
    this.setState({ template: this.state.template });
  }

  handleCreateAdvancedTemplate() {
    this.props.showAlert({
      title: '切换到进阶模式',
      content: '当前编辑的内容不会被保存。是否确定切换到进阶模式?',
      onConfirm: () => {
        this.props.hideAlert();
        this.props.showModal(<TemplateAdvancedCreate />);
      },
    });
  }

  getInspectPanel() {
    let inspectCell = this.state.inspectCell;
    let inspect;
    let options = [
      { value: 'value', label: '值' },
      { value: 'expression', label: '表达式' },
    ];

    if (!inspectCell) {
      inspect = <div className="inspect-panel">选择属性进行编辑</div>;
    } else {
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
                this.setState({ inspectCell: inspectCell });
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
                this.setState({ inspectCell: inspectCell });
              }}
            />
          </div>
          <div className="data">
            <span>描述:</span>
            <textarea
              placeholder="属性描述"
              rows="3"
              value={inspectCell.desc || ''}
              onChange={(e) => {
                inspectCell.desc = e.target.value;
                this.setState({ inspectCell: inspectCell });
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
                this.setState({ inspectCell: inspectCell });
              }}
            />
          </div>
          <div className="data">
            <span>
              {inspectCell.func === 'expression' ? '表达式' : '默认值'}:
            </span>
            <input
              type="text"
              value={inspectCell.default}
              onChange={(e) => {
                inspectCell.default = e.target.value;
                this.setState({ inspectCell: inspectCell });
              }}
            />
          </div>
          <div className="data">
            <span>测试值:</span>
            <input
              type="text"
              value={inspectCell.value}
              disabled={inspectCell.func === 'expression'}
              onChange={(e) => {
                inspectCell.value = e.target.value;
                this.setState({ inspectCell: inspectCell });
              }}
            />
          </div>
          {/*<div className="actions">
            <button>重置</button>
            <button>保存</button>
          </div>*/}
        </div>
      );
    }

    return inspect;
  }

  render() {
    return (
      <div className="template-edit">
        <div className="profile-panel">
          <div className="header">
            <button onClick={() => this.handleBack()}>&lt;返回</button>
            <input
              placeholder="模板名"
              value={this.state.name}
              onChange={(e) => this.setState({ name: e.target.value })}
            />
            <button onClick={() => this.handleSave()}>保存</button>
          </div>
          <div className="desc">
            <textarea
              placeholder="模板描述"
              rows="4"
              cols="60"
              value={this.state.desc}
              onChange={(e) => this.setState({ desc: e.target.value })}
            />
          </div>
          <div className="actions">
            <button
              onClick={() => {
                let newCell = at.getInitCell();
                this.state.template.insertCell(newCell);
                this.setState({ template: this.state.template });
              }}
            >
              <i className="iconfont">&#xe604;</i>添加新属性
            </button>
            {!this.props.isEdit && (
              <button onClick={() => this.handleCreateAdvancedTemplate()}>
                <i className="iconfont">&#xe9b7;</i>切换到进阶模式
              </button>
            )}
          </div>
          <div className="property-list">
            <table cellSpacing="0" cellPadding="0">
              <thead>
                <tr>
                  <td>属性名</td>
                  <td>默认值/表达式</td>
                  <td>测试值</td>
                  <td>操作</td>
                </tr>
              </thead>
              <tbody>
                {this.state.template.table.map((item, index) => {
                  return (
                    <TemplatePropertyCell
                      key={'template-cell-' + index}
                      isActive={item === this.state.inspectCell}
                      name={item.name}
                      defaultValue={item.default}
                      value={item.value}
                      onEdit={() => this.handleEdit(item)}
                      onRemove={() => this.handleRemove(item, index)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {this.getInspectPanel()}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    currentEditedTemplate: state.getIn(['actor', 'currentEditedTemplate']),
  }),
  (dispatch) => ({
    showModal: (body) => dispatch(showModal(body)),
    showAlert: (payload) => dispatch(showAlert(payload)),
    hideAlert: () => dispatch(hideAlert()),
    createTemplate: (name, desc, avatar, info) =>
      dispatch(createTemplate(name, desc, avatar, info)),
    updateTemplate: (uuid, name, desc, avatar, info) =>
      dispatch(updateTemplate(uuid, name, desc, avatar, info)),
  })
)(TemplateEdit);
