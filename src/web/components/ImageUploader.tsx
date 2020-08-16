import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { showAlert } from '../../shared/redux/actions/ui';
import _get from 'lodash/get';
import AvatarPicker from './AvatarPicker';
import { blobUrlToFile } from '@web/utils/file-helper';
import { toAvatar } from '@shared/utils/upload-helper';
import { TRPGDispatchProp, TRPGState } from '@src/shared/redux/types/__all__';
import classNames from 'classnames';

import './ImageUploader.scss';

type CSSUnit = number | string;

interface Props extends TRPGDispatchProp {
  type: 'actor' | 'user' | 'group';
  attachUUID?: string;
  width?: CSSUnit;
  height?: CSSUnit;
  containerWidth?: CSSUnit;
  containerHeight?: CSSUnit;
  onUploadSuccess?: (imageInfo: any) => void;
  circle?: boolean;

  user_uuid: string; // 绑定的用户UUID

  children?: React.ReactNode;
}

/**
 * 用于当前用户相关图片上传
 */
class ImageUploader extends React.Component<Props> {
  state = {
    isUploading: false,
    uploadProgress: 0,
  };

  /**
   * 选择图片后回调
   */
  handlePickImage = async (blobUrl: string) => {
    const file = await blobUrlToFile(blobUrl);

    const headers = {
      'avatar-type': this.props.type || 'actor',
    };
    if (this.props.attachUUID) {
      headers['attach-uuid'] = this.props.attachUUID;
    }
    this.setState({ isUploading: true });

    toAvatar(this.props.user_uuid, file, {
      uploadField: 'avatar',
      headers,
      onProgress: (percent) => {
        const uploadProgress = (percent * 100).toFixed();
        console.log(`进度:${uploadProgress}`);
        this.setState({ uploadProgress });
      },
    })
      .then((json) => {
        this.setState({
          isUploading: false,
          uploadProgress: 0,
        });
        if (typeof json === 'object') {
          console.log('上传成功', json);
          if (this.props.onUploadSuccess) {
            this.props.onUploadSuccess(json);
          }
        } else {
          this.props.dispatch(showAlert('图片上传失败:' + json));
          console.error(json);
        }
      })
      .catch((e) => {
        this.setState({
          isUploading: false,
          uploadProgress: 0,
        });
        const errorMsg = _get(e, 'response.data.msg', e.toString());
        this.props.dispatch(showAlert('图片上传失败:' + errorMsg));
        console.error(e);
      });
  };

  render() {
    return (
      <AvatarPicker
        className="image-uploader"
        disabled={this.state.isUploading}
        onChange={this.handlePickImage}
      >
        {this.props.children}
        <div
          className={classNames('mask', {
            active: this.state.isUploading,
            circle: this.props.circle,
          })}
        >
          {this.state.isUploading
            ? this.state.uploadProgress
              ? `${this.state.uploadProgress}%`
              : '图片上传中...'
            : '点击上传图片'}
        </div>
      </AvatarPicker>
    );
  }
}

export default connect((state: TRPGState) => ({
  user_uuid: state.user.info.uuid!,
}))(ImageUploader);
