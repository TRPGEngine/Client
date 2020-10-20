import React from 'react';
import { connect } from 'react-redux';
import config from '../../../shared/project.config';
import ModalPanel from '../ModalPanel';
import ImageUploader from '../ImageUploader';
import { hideModal } from '../../../shared/redux/actions/ui';
import { requestUpdateGroupInfo } from '../../../shared/redux/actions/group';

import './GroupEdit.scss';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';

interface Props extends TRPGDispatchProp {
  selectedGroupUUID: string;
  selectedGroupInfo: any;
}
interface State {
  avatar: string;
  name: string;
  sub_name: string;
  desc: string;
}
class GroupEdit extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      avatar: props.selectedGroupInfo.avatar ?? '',
      name: props.selectedGroupInfo.name ?? '',
      sub_name: props.selectedGroupInfo.sub_name ?? '',
      desc: props.selectedGroupInfo.desc ?? '',
    };
  }

  handleSaveGroupInfo() {
    const groupInfoData: State = Object.assign({}, this.state);
    delete groupInfoData.avatar;
    this.props.dispatch(
      requestUpdateGroupInfo(this.props.selectedGroupUUID, groupInfoData)
    );
  }

  handleUpdateAvatar(url: string) {
    this.props.dispatch(
      requestUpdateGroupInfo(this.props.selectedGroupUUID, { avatar: url })
    );
  }

  render() {
    const actions = (
      <div className="actions">
        <button onClick={() => this.props.dispatch(hideModal())}>
          <i className="iconfont">&#xe70c;</i>取消
        </button>
        <button onClick={() => this.handleSaveGroupInfo()}>
          <i className="iconfont">&#xe634;</i>保存
        </button>
      </div>
    );

    return (
      <ModalPanel
        title="编辑团信息"
        actions={actions}
        className="group-info-edit"
      >
        <ImageUploader
          width="57"
          height="57"
          type="group"
          attachUUID={this.props.selectedGroupUUID}
          onUploadSuccess={(json) => this.handleUpdateAvatar(json.url)}
        >
          <img
            src={
              this.state.avatar || config.defaultImg.getGroup(this.state.name)
            }
          />
        </ImageUploader>
        <div>
          <span>团名称</span>
          <input
            value={this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
          />
        </div>
        <div>
          <span>团副名</span>
          <input
            value={this.state.sub_name}
            onChange={(e) => this.setState({ sub_name: e.target.value })}
          />
        </div>
        <div>
          <span>团简介</span>
          <textarea
            value={this.state.desc}
            onChange={(e) => this.setState({ desc: e.target.value })}
          />
        </div>
      </ModalPanel>
    );
  }
}

export default connect((state: TRPGState) => {
  const selectedGroupUUID = state.group.selectedGroupUUID;
  const selectedGroupIndex = state.group.groups.findIndex(
    (g) => g.uuid === selectedGroupUUID
  );
  return {
    selectedGroupUUID,
    selectedGroupInfo: state.group.groups[selectedGroupIndex],
  };
})(GroupEdit);
