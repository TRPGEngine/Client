const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const fileUrl = require('../api/trpg.api.js').fileUrl;

require('./ImageUploader.scss');

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: 'http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png',
    };
    this.fileUrl = '';
  }

  _handleSelect() {
    let a = this.refs.file.click();
  }

  _handleUpload() {
    let file = this.refs.file.files[0];
    let formData = new FormData();
    formData.append('avatar', file);

    fetch(fileUrl+"/avatar", {
      method: 'POST',
      headers: {
        'avatar-type': 'actor',
        'user-uuid': this.props.user_uuid,
      },
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
        <input type="file" ref="file" onChange={(e) => this._handleUpload()} />
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
