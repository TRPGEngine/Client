import React from 'react';
import { connect } from 'react-redux';
import at from 'trpg-actor-template';
import TemplateSelect from './TemplateSelect';
import ActorCreate from '@components/modal/ActorCreate';
import ActorEdit from '@components/modal/ActorEdit';
import { updateActor } from '@redux/actions/actor';
import * as apiHelper from '../../../../shared/utils/api-helper';
import { showModal, showAlert } from '../../../../redux/actions/ui';
import {
  selectActor,
  removeActor,
  selectTemplate,
} from '../../../../redux/actions/actor';
import ActorInfo from '@components/modal/ActorInfo';
import _isNil from 'lodash/isNil';

import './ActorList.scss';
import { message } from 'antd';

class ActorList extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleAddNewActor() {
    this.props.selectActor('');
    this.props.showModal(<ActorCreate />);
  }

  _handleRemoveActor(uuid) {
    this.props.selectActor('');
    this.props.showAlert({
      content: '你确定要删除该人物卡么？删除后会同时删除相关的团人物并无法找回',
      onConfirm: () => this.props.removeActor(uuid),
    });
  }

  _handleEditActor(uuid, template_uuid) {
    this.props.selectActor(uuid);

    // 获取模板信息
    apiHelper.getTemplate(template_uuid, (template) => {
      this.props.selectTemplate(template);
      this.props.showModal(<ActorEdit />);
    });
  }

  handleOpenActorEditModal(uuid) {
    // TODO
    const actor = this.props.actors.find((a) => a.get('uuid') === uuid);
    if (_isNil(actor)) {
      message.error('角色不存在');
      return;
    }
    const templateLayout = this.props.templateCache.getIn([
      actor.get('template_uuid'),
      'layout',
    ]);

    const name = actor.get('name');
    const desc = actor.get('desc');
    const avatar = actor.get('avatar');

    this.props.showModal(
      <ActorEdit
        name={name}
        desc={desc}
        avatar={avatar}
        data={actor.get('info')}
        layout={templateLayout}
        onSave={(data) =>
          this.props.updateActor(uuid, name, avatar, desc, data)
        }
      />
    );
  }

  handleOpenActorInfoModal(uuid) {
    const actor = this.props.actors.find((a) => a.get('uuid') === uuid);
    if (_isNil(actor)) {
      message.error('角色不存在');
      return;
    }
    const templateLayout = this.props.templateCache.getIn([
      actor.get('template_uuid'),
      'layout',
    ]);

    this.props.showModal(
      <ActorInfo
        name={actor.get('name')}
        desc={actor.get('desc')}
        avatar={actor.get('avatar')}
        data={actor.get('info')}
        layout={templateLayout}
      />
    );
  }

  getActorList() {
    return this.props.actors.map((item, index) => {
      let uuid = item.get('uuid');
      let backgroundStyle = {
        backgroundImage: `url(${item.get('avatar')})`,
      };
      let actorname = item.get('name');
      let desc = item.get('desc');
      let template_uuid = item.get('template_uuid');
      return (
        <div className="actor-card" key={uuid + '-' + index}>
          <div className="avatar" style={backgroundStyle} />
          <div className="profile">
            <p>
              <span>角色:</span>
              <span title={actorname}>{actorname}</span>
            </p>
            <p>
              <span>说明:</span>
              <span title={desc}>{desc}</span>
            </p>
            <p className="action">
              <button onClick={() => this._handleRemoveActor(uuid)}>
                删除
              </button>
              <button onClick={() => this.handleOpenActorEditModal(uuid)}>
                编辑
              </button>
              <button onClick={() => this.handleOpenActorInfoModal(uuid)}>
                查看
              </button>
            </p>
          </div>
        </div>
      );
    });
  }

  getActorInfo() {
    let actor;
    for (let _actor of this.props.actors) {
      if (_actor.get('uuid') === this.props.selectedActorUUID) {
        actor = _actor;
        break;
      }
    }

    if (actor && actor.get('info')) {
      let template = this.props.templateCache.get(
        actor.get('template_uuid'),
        {}
      );
      let info = at.parse(template.get('info', '{}'));
      info.setData(actor.get('info').toJS());
      let cells = info.getCells();
      return (
        <div>
          <p>
            <span>人物卡:</span>
            <span>{actor.get('name')}</span>
          </p>
          <p>
            <span>说明:</span>
            <span>{actor.get('desc')}</span>
          </p>
          {cells.map((item, index) => {
            return (
              <p key={actor.get('uuid') + index}>
                <span>{item['name']}:</span>
                <span>{item['value']}</span>
              </p>
            );
          })}
        </div>
      );
    } else {
      return <div className="no-content">没有信息</div>;
    }
  }

  render() {
    let addNewCard = (
      <div className="actor-card">
        <div
          className="actor-card-new"
          onClick={() => this._handleAddNewActor()}
        >
          <i className="iconfont">&#xe604;</i>
          <span>添加新人物</span>
        </div>
      </div>
    );
    return (
      <div className="actor">
        <div className="actor-list">
          <div className="actor-list-collection">
            {this.getActorList()}
            {addNewCard}
          </div>
        </div>
        <div className="actor-info">{this.getActorInfo()}</div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    actors: state.getIn(['actor', 'selfActors']),
    selectedActorUUID: state.getIn(['actor', 'selectedActorUUID']),
    templateCache: state.getIn(['cache', 'template']),
  }),
  (dispatch) => ({
    showModal: (body) => dispatch(showModal(body)),
    showAlert: (...args) => dispatch(showAlert(...args)),
    selectActor: (uuid) => dispatch(selectActor(uuid)),
    removeActor: (uuid) => dispatch(removeActor(uuid)),
    updateActor: (uuid, name, avatar, desc, info) =>
      dispatch(updateActor(uuid, name, avatar, desc, info)),
    selectTemplate: (template) => dispatch(selectTemplate(template)),
  })
)(ActorList);
