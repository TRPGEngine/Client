const React = require('react');
const PropTypes = require('prop-types');
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
      headers: {},
      body: formData
    }).then((response) => {
      console.log(response);
      if(response.ok) {
        return response.json();
      }
    }).then((json) => {
      console.log(json);
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

module.exports = ImageUploader;
