import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dispatch } from 'redux';
import { connect, DispatchProp } from 'react-redux';
import sb from 'react-native-style-block';
import ImageCropPicker, { Image } from 'react-native-image-crop-picker';
import axios from 'axios';
import { fileUrl } from '../../api/trpg.api';
import { toast } from '../../shared/utils/apputils';
import { updateInfo } from '../../redux/actions/user';
import { showAlert } from '../../redux/actions/ui';
import { TAvatar } from '../components/TComponent';
import ListCell from '../components/ListCell';
import _last from 'lodash/last';
import { List } from '@ant-design/react-native';
const Item = List.Item;

interface Props extends DispatchProp<any> {
  userInfo: any;
}
class ProfileModifyScreen extends React.Component<Props> {
  // TODO: 应当使用通用上传逻辑
  _uploadAvatar(uri, type, name, size, width, height) {
    const file = { uri, type, name, size };
    const formData = new FormData();
    formData.append('avatar', file as any);

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

  handleSelectAvatar() {
    ImageCropPicker.openPicker({
      width: 256,
      height: 256,
      cropping: true,
    })
      .then((image: Image) => {
        this._uploadAvatar(
          image.path,
          image.mime,
          image.filename || _last(image.path.split('/')),
          image.size,
          image.width,
          image.height
        );
      })
      .catch((err) => console.log(err));
  }

  render() {
    const userInfo = this.props.userInfo;
    const name = userInfo.get('nickname') || userInfo.get('username');
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.handleSelectAvatar()}>
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

        <List>
          <Item
            arrow="horizontal"
            extra={userInfo.get('nickname')}
            onPress={() => this.props.dispatch(showAlert('未实现'))}
          >
            昵称
          </Item>
          <Item
            arrow="horizontal"
            extra={userInfo.get('sex')}
            onPress={() => this.props.dispatch(showAlert('未实现'))}
          >
            性别
          </Item>
          <Item
            arrow="horizontal"
            extra={userInfo.get('sign')}
            onPress={() => this.props.dispatch(showAlert('未实现'))}
          >
            个性签名
          </Item>
        </List>
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
};

export default connect((state: any) => ({
  userInfo: state.getIn(['user', 'info']),
}))(ProfileModifyScreen);
