import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect, DispatchProp } from 'react-redux';
import sb from 'react-native-style-block';
import ImageCropPicker, { Image } from 'react-native-image-crop-picker';
import axios from 'axios';
import { fileUrl } from '../../../shared/api/trpg.api';
import { toast } from '../utils/apputils';
import { updateInfo } from '../../../shared/redux/actions/user';
import { showModal, hideModal } from '../../../shared/redux/actions/ui';
import { TAvatar, TInput } from '../../components/TComponent';
import _last from 'lodash/last';
import { List } from '@ant-design/react-native';
import TModalPanel from '../../components/TComponent/TModalPanel';
import TPicker from '../../components/TComponent/TPicker';
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

  /**
   * 更新用户信息
   * 成功后关闭modal弹窗
   */
  updateUserInfo(data: {}) {
    const { dispatch } = this.props;

    dispatch(updateInfo(data, () => dispatch(hideModal())));
  }

  /**
   * 编辑昵称事件
   */
  handleEditNickname = () => {
    const { dispatch, userInfo } = this.props;
    let nickname = userInfo.get('nickname');

    dispatch(
      showModal(
        <TModalPanel onOk={() => this.updateUserInfo({ nickname })}>
          <TInput
            defaultValue={nickname}
            onChangeText={(text) => (nickname = text)}
          />
        </TModalPanel>
      )
    );
  };

  /**
   * 编辑性别事件
   */
  handleEditSex = () => {
    const { dispatch, userInfo } = this.props;
    let sex = userInfo.get('sex');

    dispatch(
      showModal(
        <TModalPanel onOk={() => this.updateUserInfo({ sex })}>
          <TPicker
            items={[
              { label: '男', value: '男' },
              { label: '女', value: '女' },
              { label: '其他', value: '其他' },
              { label: '保密', value: '保密' },
            ]}
            defaultValue={sex}
            onValueChange={(val) => (sex = val)}
          />
        </TModalPanel>
      )
    );
  };

  /**
   * 编辑个人签名事件
   */
  handleEditSign = () => {
    const { dispatch, userInfo } = this.props;
    let sign = userInfo.get('sign');

    dispatch(
      showModal(
        <TModalPanel onOk={() => this.updateUserInfo({ sign })}>
          <TInput
            multiline={true}
            numberOfLines={4}
            defaultValue={sign}
            onChangeText={(text) => (sign = text)}
            style={{ maxHeight: 320 }}
          />
        </TModalPanel>
      )
    );
  };

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
            onPress={this.handleEditNickname}
          >
            昵称
          </Item>
          <Item
            arrow="horizontal"
            extra={userInfo.get('sex')}
            onPress={this.handleEditSex}
          >
            性别
          </Item>
          <Item
            arrow="horizontal"
            extra={userInfo.get('sign')}
            onPress={this.handleEditSign}
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
