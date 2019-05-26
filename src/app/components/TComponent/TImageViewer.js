import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import { View, Modal, TouchableOpacity } from 'react-native';

class TImageViewer extends React.Component {
  state = {
    index: 0,
    modalVisible: false,
  };

  get images() {
    let ret = [];
    if (this.props.images) {
      ret = this.props.images;
      if (!Array.isArray(ret)) {
        ret = [ret];
      }

      ret = ret.map((r) => {
        if (typeof r === 'string') {
          return { url: r };
        }
      });
    }

    return ret;
  }

  get menuContext() {
    return { saveToLocal: '保存到相册', cancel: '取消' };
  }

  _handlePressChildren() {
    this.setState({ modalVisible: true });
  }

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
            // saveToLocalByLongPress={true}
            enableSwipeDown={true}
            menuContext={this.menuContext}
          />
        </Modal>
        <TouchableOpacity onPress={() => this._handlePressChildren()}>
          {this.props.children}
        </TouchableOpacity>
      </View>
    );
  }
}

export default TImageViewer;
