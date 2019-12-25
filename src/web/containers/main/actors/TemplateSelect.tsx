import React from 'react';
import { connect } from 'react-redux';
import { showModal, showAlert } from '@shared/redux/actions/ui';
import {
  setEditedTemplate,
  findTemplate,
  selectTemplate,
  removeTemplate,
} from '@shared/redux/actions/actor';
import TemplateEdit from './TemplateEdit';
import ActorEdit from './ActorEdit';
import TemplateItem from '@web/components/TemplateItem';
import ModalPanel from '@web/components/ModalPanel';
import ReactTooltip from 'react-tooltip';

import './TemplateSelect.scss';
import { TRPGDispatch, TRPGState } from '@redux/types/__all__';

interface Props {
  findTemplate: any;
  setEditedTemplate: any;
  findingResult: any;
  selfTemplate: any;
  username: any;

  showModal: any;
  selectTemplate: any;
  showAlert: any;
  removeTemplate: any;
}
class TemplateSelect extends React.Component<Props> {
  state = {
    searchName: '',
  };

  handleSearch() {
    // console.log(this.state.searchName);
    let searchName = this.state.searchName;
    this.props.findTemplate(searchName);
  }

  handleCreateTemplate() {
    this.props.setEditedTemplate({});
    this.props.showModal(<TemplateEdit isEdit={false} />);
  }

  handleCreateActor(template) {
    this.props.selectTemplate(template);
    this.props.showModal(<ActorEdit />);
  }

  handleEdit(item) {
    this.props.setEditedTemplate(item);
    this.props.showModal(<TemplateEdit isEdit={true} />);
  }

  handleDelete(item) {
    let template_uuid = item.get('uuid');
    this.props.showAlert({
      content: '你确定要删除该模板么？删除后仍会保留相关联的人物卡与团人物',
      onConfirm: () => this.props.removeTemplate(template_uuid),
    });
  }

  getFindResult() {
    const findingResult = this.props.findingResult;
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
              onCreate={() => this.handleCreateActor(item)}
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
            <button onClick={() => this.handleSearch()}>
              <i className="iconfont">&#xe60a;</i>搜索
            </button>
            <button onClick={() => this.handleCreateTemplate()}>
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
                    onEdit={() => this.handleEdit(item)}
                    onCreate={() => this.handleCreateActor(item)}
                    onDelete={() => this.handleDelete(item)}
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
  (state: TRPGState) => ({
    username: state.user.info.username,
    findingResult: state.actor.findingResult,
    selfTemplate: state.actor.selfTemplate,
  }),
  (dispatch: TRPGDispatch) => ({
    showModal: (body) => dispatch(showModal(body)),
    showAlert: (body) => dispatch(showAlert(body)),
    setEditedTemplate: (obj) => dispatch(setEditedTemplate(obj)),
    findTemplate: (name) => dispatch(findTemplate(name)),
    selectTemplate: (template) => dispatch(selectTemplate(template)),
    removeTemplate: (uuid) => dispatch(removeTemplate(uuid)),
  })
)(TemplateSelect);
