import React from 'react';
import PhotoBrowser from 'react-native-photo-browser';

class PhotoBrowserScreen extends React.Component {
  static navigationOptions = {
    //1.隐藏导航头部
    header: null,
  };
  _goBack = () => {
    //2.点击返回关闭页面
    this.props.navigation.goBack();
  };
  render() {
    //3.获取传入的图片等信息
    const { params } = this.props.navigation.state;
    const media = params.media;
    const index = params.index || 0;
    return (
      <PhotoBrowser
        onBack={this._goBack}
        mediaList={media}
        initialIndex={index}
        displayActionButton={false}
        displayTopBar={true}
        enableGrid={false}
      />
    );
  }
}

export default PhotoBrowserScreen;
