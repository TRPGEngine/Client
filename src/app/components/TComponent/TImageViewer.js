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

  _handlePressChildren() {
    this.setState({ modalVisible: true });
  }

  render() {
    console.log(this.images);
    return (
      <View>
        <Modal
          visible={this.state.modalVisible}
          transparent={true}
          onRequestClose={() => this.setState({ modalVisible: false })}
          onPress={() => this.setState({ modalVisible: false })}
        >
          <ImageViewer
            imageUrls={this.images}
            index={this.state.index}
            onSwipeDown={() => {
              console.log('onSwipeDown');
            }}
            onMove={(data) => console.log(data)}
            enableSwipeDown={true}
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
