import React from 'react';
import { connect } from 'react-redux';
import * as at from 'trpg-actor-template';
import TemplateSelect from './TemplateSelect';
import ActorCreate from '@web/components/modal/ActorCreate';
import ActorEdit from '@web/components/modal/ActorEdit';
import * as apiHelper from '@shared/utils/api-helper';
import { showModal, showAlert } from '@shared/redux/actions/ui';
import { updateActor } from '@web/redux/action/actor';
import {
  selectActor,
  removeActor,
  selectTemplate,
} from '@shared/redux/actions/actor';
import ActorInfo from '@web/components/modal/ActorInfo';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';

import './ActorList.scss';
import { message } from 'antd';
import { TRPGDispatch, TRPGState } from '@redux/types/__all__';
import { AlertPayload } from '@redux/types/ui';

interface Props {
  selectActor: any;
  showModal: any;
  showAlert: (payload: AlertPayload) => void;
  removeActor: any;
  selectTemplate: any;
  actors: any;
  templateCache: any;
  updateActor: any;
  selectedActorUUID: string;
}
class ActorList extends React.Component<Props> {
  handleAddNewActor() {
    this.props.selectActor('');
    this.props.showModal(<ActorCreate />);
  }

  handleRemoveActor(uuid) {
    this.props.selectActor('');
    this.props.showAlert({
      content: '你确定要删除该人物卡么？删除后会同时删除相关的团人物并无法找回',
      onConfirm: () => this.props.removeActor(uuid),
    });
  }

  handleEditActor(uuid, template_uuid) {
    this.props.selectActor(uuid);

    // 获取模板信息
    apiHelper.getTemplate(template_uuid, (template) => {
      this.props.selectTemplate(template);
      this.props.showModal(<ActorEdit />);
    });
  }

  handleOpenActorEditModal(uuid) {
    // TODO
    const actor = this.props.actors.find((a) => a.uuid === uuid);
    if (_isNil(actor)) {
      message.error('角色不存在');
      return;
    }
    const templateLayout = _get(this.props.templateCache, [
      actor.template_uuid,
      'layout',
    ]);

    const name = actor.name;
    const desc = actor.desc;
    const avatar = actor.avatar;

    this.props.showModal(
      <ActorEdit
        name={name}
        desc={desc}
        avatar={avatar}
        data={actor.info}
        layout={templateLayout}
        onSave={(data) => {
          this.props.updateActor(
            uuid,
            data._name,
            data._avatar,
            data._desc,
            data
          );
        }}
      />
    );
  }

  handleOpenActorInfoModal(uuid) {
    const actor = this.props.actors.find((a) => a.uuid === uuid);
    if (_isNil(actor)) {
      message.error('角色不存在');
      return;
    }
    const templateLayout = _get(this.props.templateCache, [
      actor.template_uuid,
      'layout',
    ]);

    this.props.showModal(
      <ActorInfo
        name={actor.name}
        desc={actor.desc}
        avatar={actor.avatar}
        data={actor.info}
        layout={templateLayout}
      />
    );
  }

  getActorList() {
    return this.props.actors.map((item, index) => {
      let uuid = item.uuid;
      let backgroundStyle = {
        backgroundImage: `url(${item.avatar})`,
      };
      let actorname = item.name;
      let desc = item.desc;
      let template_uuid = item.template_uuid;
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
              <button onClick={() => this.handleRemoveActor(uuid)}>删除</button>
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
      if (_actor.uuid === this.props.selectedActorUUID) {
        actor = _actor;
        break;
      }
    }

    if (actor && actor.info) {
      let template = this.props.templateCache[actor.template_uuid] ?? {};
      let info = at.parse(template.info ?? {});
      info.setData(actor.info);
      let cells = info.getCells();
      return (
        <div>
          <p>
            <span>人物卡:</span>
            <span>{actor.name}</span>
          </p>
          <p>
            <span>说明:</span>
            <span>{actor.desc}</span>
          </p>
          {cells.map((item, index) => {
            return (
              <p key={actor.uuid + index}>
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
          onClick={() => this.handleAddNewActor()}
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
  (state: TRPGState) => ({
    actors: state.actor.selfActors,
    selectedActorUUID: state.actor.selectedActorUUID,
    templateCache: state.cache.template,
  }),
  (dispatch: TRPGDispatch) => ({
    showModal: (body) => dispatch(showModal(body)),
    showAlert: (payload: AlertPayload) => dispatch(showAlert(payload)),
    selectActor: (uuid) => dispatch(selectActor(uuid)),
    removeActor: (uuid) => dispatch(removeActor(uuid)),
    updateActor: (uuid, name, avatar, desc, info) =>
      dispatch(updateActor(uuid, name, avatar, desc, info)),
    selectTemplate: (template) => dispatch(selectTemplate(template)),
  })
)(ActorList);
