import React from 'react';
import { connect } from 'react-redux';
import { showModal, showAlert } from '../../../../redux/actions/ui';
import {
  setEditedTemplate,
  findTemplate,
  selectTemplate,
  removeTemplate,
} from '../../../../redux/actions/actor';
import TemplateEdit from './TemplateEdit';
import ActorEdit from './ActorEdit';
import TemplateItem from '../../../components/TemplateItem';
import ModalPanel from '../../../components/ModalPanel';
import ReactTooltip from 'react-tooltip';

require('./TemplateSelect.scss');

class TemplateSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: '',
    };
  }

  _handleSearch() {
    // console.log(this.state.searchName);
    let searchName = this.state.searchName;
    this.props.findTemplate(searchName);
  }

  _handleCreateTemplate() {
    this.props.setEditedTemplate({});
    this.props.showModal(<TemplateEdit isEdit={false} />);
  }

  _handleCreateActor(template) {
    template = template.toJS();
    this.props.selectTemplate(template);
    this.props.showModal(<ActorEdit />);
  }

  _handleEdit(item) {
    this.props.setEditedTemplate(item.toJS());
    this.props.showModal(<TemplateEdit isEdit={true} />);
  }

  _handleDelete(item) {
    let template_uuid = item.get('uuid');
    this.props.showAlert({
      content: '你确定要删除该模板么？删除后仍会保留相关联的人物卡与团人物',
      onConfirm: () => this.props.removeTemplate(template_uuid),
    });
  }

  getFindResult() {
    let findingResult = this.props.findingResult;
    if (findingResult) {
      if (findingResult.size === 0) {
        return <div className="no-result">暂无搜索结果...</div>;
      } else {
        return findingResult.map((item, index) => {
          return (
            <TemplateItem
              key={'template-find-result' + item.get('uuid')}
              canEdit={false}
              name={item.get('name')}
              desc={item.get('desc')}
              creator={item.get('creator_name') || '未知'}
              time={item.get('updateAt')}
              onCreate={() => this._handleCreateActor(item)}
            />
          );
        });
      }
    } else {
      return null;
    }
  }

  render() {
    return (
      <ModalPanel title="创建人物卡">
        <div className="template-select">
          <ReactTooltip effect="solid" />
          <div className="header">
            <input
              type="text"
              placeholder="输入要搜索的模板名"
              value={this.state.searchName}
              onChange={(e) => {
                this.setState({ searchName: e.target.value });
              }}
            />
            <button onClick={() => this._handleSearch()}>
              <i className="iconfont">&#xe60a;</i>搜索
            </button>
            <button onClick={() => this._handleCreateTemplate()}>
              <i className="iconfont">&#xe604;</i>创建新的人物模板
            </button>
          </div>
          <div className="body">
            <div className="search-result">
              <p className="title">搜索列表</p>
              {this.getFindResult()}
            </div>
            <div className="self-template">
              <p className="title">我的模板</p>
              {this.props.selfTemplate.map((item, index) => {
                return (
                  <TemplateItem
                    key={item.get('uuid')}
                    canEdit={true}
                    name={item.get('name')}
                    desc={item.get('desc')}
                    creator={this.props.username}
                    time={item.get('updateAt')}
                    onEdit={() => this._handleEdit(item)}
                    onCreate={() => this._handleCreateActor(item)}
                    onDelete={() => this._handleDelete(item)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </ModalPanel>
    );
  }
}

export default connect(
  (state) => ({
    username: state.getIn(['user', 'info', 'username']),
    findingResult: state.getIn(['actor', 'findingResult']),
    selfTemplate: state.getIn(['actor', 'selfTemplate']),
  }),
  (dispatch) => ({
    showModal: (body) => dispatch(showModal(body)),
    showAlert: (body) => dispatch(showAlert(body)),
    setEditedTemplate: (obj) => dispatch(setEditedTemplate(obj)),
    findTemplate: (name) => dispatch(findTemplate(name)),
    selectTemplate: (template) => dispatch(selectTemplate(template)),
    removeTemplate: (uuid) => dispatch(removeTemplate(uuid)),
  })
)(TemplateSelect);
