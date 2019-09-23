import React from 'react';
import { connect } from 'react-redux';
import Base from './Base';
import filesize from 'filesize';
import config from '../../../shared/project.config';
import { downloadFile, previewFile } from '../../../shared/redux/actions/file';

class File extends Base {
  handlePreview() {
    let data = this.props.info.data;
    this.props.dispatch(previewFile(data.fileuuid));
  }

  handleDownload() {
    let data = this.props.info.data;
    this.props.dispatch(downloadFile(data.fileuuid));
  }

  getContent() {
    const info = this.props.info;
    const data = info.data;
    return (
      <div className="bubble">
        <div className="file-info">
          <div
            className="file-avatar"
            style={{
              backgroundImage: `url(${config.file.getFileImage(data.ext)})`,
            }}
          />
          <div className="file-prop">
            <h3 title={data.originalname}>{data.originalname}</h3>
            <p>{filesize(data.size)}</p>
          </div>
        </div>
        {data.progress !== 1 ? (
          <div className="file-progress">
            <div style={{ width: data.progress * 100 + '%' }} />
          </div>
        ) : (
          <div className="file-action">
            {data.can_preview ? (
              <button onClick={() => this.handlePreview()}>
                <i className="iconfont">&#xe6a2;</i>预览
              </button>
            ) : null}
            <button onClick={() => this.handleDownload()}>
              <i className="iconfont">&#xe688;</i>下载
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default connect()(File);
