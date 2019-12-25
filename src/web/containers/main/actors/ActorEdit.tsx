import React from 'react';
import { connect } from 'react-redux';
import at from 'trpg-actor-template';
import config from '@shared/project.config';
import { showAlert } from '@shared/redux/actions/ui';
import { createActor, updateActor } from '@shared/redux/actions/actor';
import ImageUploader from '@web/components/ImageUploader';

import './ActorEdit.scss';
import { AlertPayload } from '@redux/types/ui';
import { TRPGDispatch, TRPGState } from '@redux/types/__all__';

interface Props {
  selectedActorUUID: string;
  selfActors: any[];
  selectedTemplate: any;

  showAlert: (payload: AlertPayload) => void;
  createActor: any;
  updateActor: any;
}
interface State {
  cells: any[];
  profileName: string;
  profileDesc: string;
  profileAvatar: string;
}
class ActorEdit extends React.Component<Props, State> {
  editedActor: any;
  template_uuid: string;
  template: any;

  state = {
    cells: [],
    profileName: '',
    profileDesc: '',
    profileAvatar: '',
  };

  constructor(props) {
    super(props);
    if (this.props.selectedActorUUID) {
      let actorIndex = this.props.selfActors.findIndex((item, index) => {
        if (item.get('uuid') === this.props.selectedActorUUID) {
          return true;
        } else {
          return false;
        }
      });

      if (actorIndex >= 0) {
        let actor = (this.editedActor = this.props.selfActors[actorIndex]);
        this.state.profileName = actor.get('name');
        this.state.profileDesc = actor.get('desc');
        this.state.profileAvatar = actor.get('avatar');
      } else {
        console.error('角色不存在');
      }
    }
  }

  componentDidMount() {
    this.template_uuid = this.props.selectedTemplate.uuid;
    let info = this.props.selectedTemplate.info;
    let template = (this.template = at.parse(info));
    if (this.editedActor) {
      let data = this.editedActor.get('info');
      template.setData(data);
    }
    template.eval();
    this.setState({ cells: template.getCells() });
  }

  handleSave() {
    let isCreate = !this.props.selectedActorUUID; //是否为新建人物

    let name = this.state.profileName;
    let avatar = this.state.profileAvatar;
    let desc = this.state.profileDesc;
    let info = this.template.getData();
    let template_uuid = this.template_uuid;
    if (!name) {
      this.props.showAlert('人物名不能为空');
    } else {
      console.log('save data', { name, avatar, desc, info, template_uuid });
      let content = (
        <div>
          <p key={template_uuid + '-cell-tip'}>
            是否要{isCreate ? '创建' : '更新'}人物？数据如下:
          </p>
          {this.template.getCells().map((cell, index) => {
            return (
              <p
                key={template_uuid + '-cell-' + index}
                style={{ textAlign: 'left' }}
              >
                {cell.name}:{cell.value}
              </p>
            );
          })}
        </div>
      );
      this.props.showAlert({
        title: isCreate ? '创建人物' : '更新人物',
        content: content,
        type: 'alert',
        onConfirm: () => {
          if (isCreate) {
            // create
            this.props.createActor(name, avatar, desc, info, template_uuid);
          } else {
            // update
            let uuid = this.props.selectedActorUUID;
            this.props.updateActor(uuid, name, avatar, desc, info);
          }
        },
      });
    }
  }

  render() {
    return (
      <div className="actor-edit">
        <div className="actor-edit-header">
          <input
            placeholder="人物卡名"
            value={this.state.profileName}
            onChange={(e) => this.setState({ profileName: e.target.value })}
          />
          <button onClick={() => this.handleSave()}>
            {this.props.selectedActorUUID ? '更新' : '创建'}
          </button>
        </div>
        <div className="actor-edit-body">
          <div className="actor-edit-profile">
            <ImageUploader
              type="actor"
              containerHeight="240px"
              onUploadSuccess={(json) =>
                this.setState({ profileAvatar: json.url })
              }
            >
              <div
                className="avatar"
                style={{
                  backgroundImage: `url(${config.file.getAbsolutePath(
                    this.state.profileAvatar
                  )})`,
                }}
              />
            </ImageUploader>
            <div className="desc">
              <textarea
                placeholder="人物卡描述/背景"
                value={this.state.profileDesc}
                onChange={(e) => this.setState({ profileDesc: e.target.value })}
              />
            </div>
          </div>
          <div className="actor-edit-property">
            {this.state.cells.map((item, index) => {
              let isExpression = item.func === 'expression';
              return (
                <div
                  key={item.uuid + '-' + index}
                  className="actor-property-cell"
                >
                  <div className="cell-name">{item.name}:</div>
                  <div className="cell-value">
                    <input
                      disabled={isExpression}
                      placeholder={isExpression ? item.value : item.default}
                      value={item.value}
                      onChange={(e) => {
                        try {
                          let cells = this.state.cells;
                          cells[index].value = e.target.value;
                          this.setState({ cells });
                          this.template.eval();
                        } catch (e) {
                          console.warn(e);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state: TRPGState) => ({
    selectedTemplate: state.actor.selectedTemplate,
    selectedActorUUID: state.actor.selectedActorUUID,
    selfActors: state.actor.selfActors,
  }),
  (dispatch: TRPGDispatch) => ({
    showAlert: (msg: AlertPayload) => {
      dispatch(showAlert(msg));
    },
    createActor: (name, avatar, desc, info, template_uuid) => {
      dispatch(createActor(name, avatar, desc, info, template_uuid));
    },
    updateActor: (uuid, name, avatar, desc, info) => {
      dispatch(updateActor(uuid, name, avatar, desc, info));
    },
  })
)(ActorEdit);
