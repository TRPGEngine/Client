import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import sb from 'react-native-style-block';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { fileUrl } from '../../api/trpg.api.js';
import { toast } from '../../shared/utils/apputils';
import { updateInfo } from '../../redux/actions/user';
import { showAlert } from '../../redux/actions/ui';
import { TAvatar } from '../components/TComponent';
import ListCell from '../components/ListCell';

class ProfileModifyScreen extends React.Component {
  // TODO: 应当使用通用上传逻辑
  _uploadAvatar(uri, type, name, size, width, height) {
    const file = { uri, type, name, size };
    const formData = new FormData();
    formData.append('avatar', file);

    const headers = {
      'avatar-type': 'user',
      'user-uuid': this.props.userInfo.get('uuid'),
      'attach-uuid': this.props.userInfo.get('uuid'),
      width,
      height,
    };

    axios({
      url: fileUrl + '/avatar',
      method: 'post',
      headers,
      data: formData,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          console.log(`进度:${progressEvent.loaded}/${progressEvent.total}`);
        }
      },
    })
      .then((res) => {
        return res.data;
      })
      .then((json) => {
        this.setState({
          isUploading: false,
          uploadProgress: 0,
        });
        if (typeof json === 'object') {
          console.log('上传成功', json);
          toast('上传成功');
          // 更新头像
          this.props.dispatch(updateInfo({ avatar: json.url }));
        } else {
          console.error(json);
          toast('图片上传失败:' + json);
        }
      })
      .catch((e) => {
        toast('图片上传失败:' + e);
        console.error(e);
      });
  }

  _handleSelectAvatar() {
    const options = {
      title: '选择头像',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍一张照片',
      chooseFromLibraryButtonTitle: '从相册选一张',
      mediaType: 'photo',
      maxWidth: 128,
      maxHeight: 128,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('图片选择结果:', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this._uploadAvatar(
          response.uri,
          response.type,
          response.fileName,
          response.fileSize,
          response.width,
          response.height
        );
      }
    });
  }

  render() {
    const userInfo = this.props.userInfo;
    const name = userInfo.get('nickname') || userInfo.get('username');
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this._handleSelectAvatar()}>
            <TAvatar
              style={styles.avatar}
              uri={userInfo.get('avatar', '')}
              name={name}
              capitalSize={40}
              height={100}
              width={100}
            />
          </TouchableOpacity>
          <Text style={styles.username}>{userInfo.get('username')}</Text>
          <Text style={styles.uuid}>{userInfo.get('uuid')}</Text>
        </View>

        <View>
          <ListCell
            title="昵称"
            value={userInfo.get('nickname')}
            onPress={() => {
              this.props.dispatch(showAlert('未实现'));
            }}
          />
          <ListCell
            title="性别"
            value={userInfo.get('sex')}
            onPress={() => {
              this.props.dispatch(showAlert('未实现'));
            }}
          />
          <ListCell
            title="个性签名"
            value={userInfo.get('sign')}
            onPress={() => {
              this.props.dispatch(showAlert('未实现'));
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: [{ flex: 1 }],
  header: [
    { marginBottom: 10 },
    sb.alignCenter(),
    sb.bgColor('white'),
    sb.padding(20, 0),
  ],
  avatar: [sb.radius(50)],
  username: [sb.font(18), sb.margin(10, 0, 0, 0)],
  uuid: [sb.font(12)],
  // item: [
  //   {flexDirection: 'row'},
  //   sb.padding(10, 4),
  //   sb.border('Bottom', 0.5, '#eee'),
  // ],
  // actions: [
  //   sb.padding(10),
  // ],
};

export default connect((state) => ({
  userInfo: state.getIn(['user', 'info']),
}))(ProfileModifyScreen);
