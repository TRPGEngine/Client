const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../config/project.config.js');
const ModalPanel = require('../ModalPanel');
const ImageUploader = require('../ImageUploader');
const { hideModal } = require('../../../redux/actions/ui');
const { updateGroupInfo } = require('../../../redux/actions/group');

require('./GroupEdit.scss');

class GroupEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: props.selectedGroupInfo.get('avatar') || '',
      name: props.selectedGroupInfo.get('name') || '',
      sub_name: props.selectedGroupInfo.get('sub_name') || '',
      desc: props.selectedGroupInfo.get('desc') || '',
    };
  }

  _handleSaveGroupInfo() {
    let groupInfoData = Object.assign({}, this.state);
    delete groupInfoData.avatar;
    this.props.dispatch(
      updateGroupInfo(this.props.selectedGroupUUID, groupInfoData)
    );
  }

  _handleUpdateAvatar(url) {
    this.props.dispatch(
      updateGroupInfo(this.props.selectedGroupUUID, { avatar: url })
    );
  }

  render() {
    let actions = (
      <div className="actions">
        <button onClick={() => this.props.dispatch(hideModal())}>
          <i className="iconfont">&#xe70c;</i>取消
        </button>
        <button onClick={() => this._handleSaveGroupInfo()}>
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
          onUploadSuccess={(json) => this._handleUpdateAvatar(json.url)}
        >
          <img src={this.state.avatar || config.defaultImg.group} />
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

module.exports = connect((state) => {
  let selectedGroupUUID = state.getIn(['group', 'selectedGroupUUID']);
  let selectedGroupIndex = state
    .getIn(['group', 'groups'])
    .findIndex((g) => g.get('uuid') === selectedGroupUUID);
  return {
    selectedGroupUUID,
    selectedGroupInfo: state.getIn(['group', 'groups', selectedGroupIndex]),
  };
})(GroupEdit);
