import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import { View, Modal, TouchableOpacity } from 'react-native';
import { saveImageToLocal } from '@src/app/src/utils/file-helper';
import { Toast } from '@ant-design/react-native';

interface Props {
  /**
   * 图片地址列表
   * 可以为单个字符串，也可以是一个字符串列表
   */
  images: string | string[];
}

class TImageViewer extends React.Component<Props> {
  state = {
    index: 0,
    modalVisible: false,
  };

  get images() {
    const images = this.props.images;
    if (images) {
      let list: string[] = [];
      if (!Array.isArray(images)) {
        list = [images];
      } else {
        list = images;
      }

      return list.map((r) => {
        if (typeof r === 'string') {
          return { url: r };
        }
      });
    } else {
      return [];
    }
  }

  get menuContext() {
    return { saveToLocal: '保存到相册', cancel: '取消' };
  }

  handlePressChildren() {
    this.setState({ modalVisible: true });
  }

  handleSaveImage = (url: string) => {
    saveImageToLocal(url)
      .then(() => Toast.success('保存成功'))
      .catch((e) => {
        console.error(e);
        Toast.fail('保存失败:' + e.toString());
      });
  };

  hide() {
    this.setState({ modalVisible: false });
  }

  render() {
    return (
      <View>
        <Modal
          visible={this.state.modalVisible}
          transparent={true}
          onRequestClose={() => this.hide()}
        >
          <ImageViewer
            imageUrls={this.images}
            index={this.state.index}
            onSwipeDown={() => this.hide()}
            onClick={() => this.hide()}
            // TODO: 待实现保存图片到本地的功能
            saveToLocalByLongPress={true}
            onSave={this.handleSaveImage}
            enableSwipeDown={true}
            menuContext={this.menuContext}
          />
        </Modal>
        <TouchableOpacity onPress={() => this.handlePressChildren()}>
          {this.props.children}
        </TouchableOpacity>
      </View>
    );
  }
}

export default TImageViewer;
