const React = require('react');
const { connect } = require('react-redux');
const fileUrl = require('../../api/trpg.api.js').fileUrl;

require('./ImageUploader.scss');

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleSelect() {
    this.refs.file.click();
  }

  _handleUpload() {
    let file = this.refs.file.files[0];
    let formData = new FormData();
    formData.append('avatar', file);

    let headers = {
      'avatar-type': this.props.type || 'actor',
      'user-uuid': this.props.user_uuid,
    }
    if(this.props.attachUUID) {
      headers['attach-uuid'] = this.props.attachUUID;
    }
    if(this.props.width) {
      headers.width = this.props.width;
      if(this.props.height) {
        headers.height = this.props.height;
      }
    }

    fetch(fileUrl+'/avatar', {
      method: 'POST',
      headers,
      body: formData
    }).then((response) => {
      if(response.ok) {
        return response.json();
      }else {
        return response.text();
      }
    }).then((json) => {
      if(typeof json === 'object'){
        console.log('上传成功', json);
        if(this.props.onUploadSuccess) {
          this.props.onUploadSuccess(json)
        }
      }else {
        console.error(json);
      }
    }).catch((e) => {
      console.error(e);
    })
  }

  render() {
    return (
      <div className="image-uploader" onClick={() => this._handleSelect()}>
        <input
          type="file"
          ref="file"
          accept="image/*"
          onChange={(e) => this._handleUpload()}
        />
        <div className="mask">点击上传图片</div>
        {this.props.children}
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    user_uuid: state.getIn(['user', 'info', 'uuid'])
  })
)(ImageUploader);
