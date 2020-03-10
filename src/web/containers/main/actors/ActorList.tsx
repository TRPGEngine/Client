import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import * as at from 'trpg-actor-template';
import { ActorCard, ActorCardContainer } from '@web/components/ActorCard';
import ActorCreate from '@web/components/modal/ActorCreate';
import ActorEdit from '@web/components/modal/ActorEdit';
import { showModal, showAlert } from '@shared/redux/actions/ui';
import {
  removeActor,
  shareActor,
  unshareActor,
  selectActor,
} from '@shared/redux/actions/actor';
import ActorInfo from '@web/components/modal/ActorInfo';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';

import './ActorList.scss';
import { message } from 'antd';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import { ActorType } from '@redux/types/actor';
import { updateActor } from '@web/redux/action/actor';

interface Props extends TRPGDispatchProp {
  actors: ActorType[];
  templateCache: any;
  selectedActorUUID: string;
}
class ActorList extends React.Component<Props> {
  handleAddNewActor() {
    this.props.dispatch(selectActor(''));
    this.props.dispatch(showModal(<ActorCreate />));
  }

  handleRemoveActor(uuid) {
    this.props.dispatch(selectActor(''));
    this.props.dispatch(
      showAlert({
        content:
          '你确定要删除该人物卡么？删除后会同时删除相关的团人物并无法找回',
        onConfirm: () => this.props.dispatch(removeActor(uuid)),
      })
    );
  }

  /**
   * 编辑人物卡信息
   */
  handleOpenActorEditModal(uuid: string) {
    const actor = this.props.actors.find((a) => a.uuid === uuid);
    if (_isNil(actor)) {
      message.error('角色不存在');
      return;
    }

    const name = actor.name;
    const desc = actor.desc;
    const avatar = actor.avatar;
    const templateUUID = actor.template_uuid;

    this.props.dispatch(
      showModal(
        <ActorEdit
          name={name}
          desc={desc}
          avatar={avatar}
          data={actor.info}
          templateUUID={templateUUID}
          onSave={(data) => {
            this.props.dispatch(
              updateActor(uuid, data._name, data._avatar, data._desc, data)
            );
          }}
        />
      )
    );
  }

  /**
   * 查看人物卡信息
   */
  handleOpenActorInfoModal(uuid: string) {
    const actor = this.props.actors.find((a) => a.uuid === uuid);
    if (_isNil(actor)) {
      message.error('角色不存在');
      return;
    }

    this.props.dispatch(
      showModal(
        <ActorInfo
          name={actor.name}
          desc={actor.desc}
          avatar={actor.avatar}
          data={actor.info}
          templateUUID={actor.template_uuid}
        />
      )
    );
  }

  /**
   * 分享人物卡
   */
  handleShareActor = (uuid: string) => {
    this.props.dispatch(
      showAlert({
        title: '是否要分享人物卡?',
        content: '分享后人物卡会被其他人看到并允许被fork',
        onConfirm: () => {
          this.props.dispatch(shareActor(uuid));
        },
      })
    );
  };

  /**
   * 取消分享人物卡
   */
  handleUnshareActor = (uuid: string) => {
    this.props.dispatch(
      showAlert({
        title: '取消分享人物卡',
        content: '取消后无法被其他人搜到',
        onConfirm: () => {
          this.props.dispatch(unshareActor(uuid));
        },
      })
    );
  };

  getActorList() {
    return this.props.actors.map((item, index) => {
      const uuid = item.uuid;

      return (
        <ActorCard
          key={`${uuid}-${index}`}
          actor={item}
          actions={
            <Fragment>
              <button onClick={() => this.handleRemoveActor(uuid)}>删除</button>
              <button onClick={() => this.handleOpenActorEditModal(uuid)}>
                编辑
              </button>
              <button onClick={() => this.handleOpenActorInfoModal(uuid)}>
                查看
              </button>
              {item.shared ? (
                <button onClick={() => this.handleUnshareActor(uuid)}>
                  分享中
                </button>
              ) : (
                <button onClick={() => this.handleShareActor(uuid)}>
                  分享
                </button>
              )}
            </Fragment>
          }
        />
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
      <ActorCardContainer>
        <div
          className="actor-card-new"
          onClick={() => this.handleAddNewActor()}
        >
          <i className="iconfont">&#xe604;</i>
          <span>添加新人物</span>
        </div>
      </ActorCardContainer>
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

export default connect((state: TRPGState) => ({
  actors: state.actor.selfActors,
  selectedActorUUID: state.actor.selectedActorUUID,
  templateCache: state.cache.template,
}))(ActorList);
