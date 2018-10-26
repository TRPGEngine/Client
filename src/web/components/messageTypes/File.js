const React = require('react');
const Base = require('./Base');
const filesize = require('filesize');
const config = require('../../../../config/project.config')

class File extends Base {
  _handlePreview() {
    console.log('TODO: preview')
  }

  _handleDownload() {
    console.log('TODO: download')
  }

  getContent() {
    const info = this.props.info;
    const data = info.data;
    return (
      <div className="bubble">
        <div className="file-info">
          <div className="file-avatar" style={{backgroundImage: `url(${config.file.getFileImage(data.ext)})`}}></div>
          <div className="file-prop">
            <h3 title={data.originalname}>{data.originalname}</h3>
            <p>{filesize(data.size)}</p>
          </div>
        </div>
        <div className="file-action">
          {
            data.can_preview ? (
              <button><i className="iconfont">&#xe6a2;</i>预览</button>
            ) : null
          }
          <button><i className="iconfont">&#xe688;</i>下载</button>
        </div>
      </div>
    )
  }
}

module.exports = File;
