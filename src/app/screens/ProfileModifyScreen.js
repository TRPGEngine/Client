const React = require('react');
const {
  View,
  Text,
  TouchableOpacity,
} = require('react-native');
const { connect } = require('react-redux');
const sb = require('react-native-style-block');
const ImagePicker = require('react-native-image-picker');
const axios = require('axios');
const {
  TAvatar
} = require('../components/TComponent');
const fileUrl = require('../../api/trpg.api.js').fileUrl;
const { toast } = require('../../utils/apputils');
const { updateInfo } = require('../../redux/actions/user');

class ProfileModifyScreen extends React.Component {
  _uploadAvatar(uri, type, name, size, width, height) {
    const file = {uri, type, name, size};
    const formData = new FormData();
    formData.append('avatar', file);

    const headers = {
      'avatar-type': 'user',
      'user-uuid': this.props.userInfo.get('uuid'),
      'attach-uuid': this.props.userInfo.get('uuid'),
      width,
      height,
    }

    axios({
      url: fileUrl+'/avatar',
      method: 'post',
      headers,
      data: formData,
      onUploadProgress: (progressEvent) => {
        if(progressEvent.lengthComputable) {
          console.log(`进度:${progressEvent.loaded}/${progressEvent.total}`);
        }
      }
    }).then(res => {
      return res.data
    }).then(json => {
      this.setState({
        isUploading: false,
        uploadProgress: 0
      });
      if(typeof json === 'object') {
        console.log('上传成功', json);
        toast('上传成功');
        // 更新头像
        this.props.dispatch(updateInfo({avatar: json.url}));
      }else {
        console.error(json);
        toast('图片上传失败:' + json);
      }
    }).catch(e => {
      toast('图片上传失败:' + e);
      console.error(e);
    })
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
        path: 'images'
      }
    }
    ImagePicker.showImagePicker(options, (response) => {
      console.log('图片选择结果:', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this._uploadAvatar(response.uri, response.type, response.fileName, response.fileSize, response.width, response.height);
      }
    })
  }

  render() {
    const userInfo = this.props.userInfo;
    const name = userInfo.get('nickname') || userInfo.get('username');
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this._handleSelectAvatar()}>
            <TAvatar style={styles.avatar} uri={userInfo.get('avatar', '')} name={name} height={100} width={100} />
          </TouchableOpacity>
          <Text>{userInfo.get('username')}</Text>
          <Text>{userInfo.get('uuid')}</Text>
        </View>

        <View>

        </View>
      </View>
    );
  }
}

const styles = {
  container: [
    {flex: 1},
  ],
  header: [
    {marginBottom: 10},
    sb.alignCenter(),
    sb.bgColor('white'),
    sb.padding(20, 0),
  ],
  avatar: [
    sb.radius(50),
  ],
  // item: [
  //   {flexDirection: 'row'},
  //   sb.padding(10, 4),
  //   sb.border('Bottom', 0.5, '#eee'),
  // ],
  // actions: [
  //   sb.padding(10),
  // ],
}

module.exports = connect(
  state => ({
    userInfo: state.getIn(['user', 'info'])
  })
)(ProfileModifyScreen);
