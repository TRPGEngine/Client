import React from 'react';
import Lightbox from 'react-image-lightbox';
import _isEmpty from 'lodash/isEmpty';
import _findLastIndex from 'lodash/findLastIndex';

import './ImageViewer.scss';

interface Props {
  originImageUrl: string;
  allImageUrls?: string[];
}
class ImageViewer extends React.PureComponent<Props> {
  static defaultProps = {
    allImageUrls: [],
  };

  state = {
    isOpen: false,
    currentIndex: -1,
  };

  constructor(props: Props) {
    super(props);
    if (!_isEmpty(props.allImageUrls)) {
      // 先简单一点，只找到最后一张图片地址一样的
      this.state.currentIndex = _findLastIndex(
        props.allImageUrls,
        (url) => url === props.originImageUrl
      );
    }
  }

  handleClick() {
    if (this.props.originImageUrl) {
      this.setState({ isOpen: true });
    }
  }

  /**
   * 获取当前图片的Url
   */
  getImageUrlByOffset(offset: number): string {
    const { originImageUrl, allImageUrls } = this.props;

    if (this.state.currentIndex === -1) {
      return offset === 0 ? originImageUrl : undefined;
    }

    return allImageUrls[this.state.currentIndex + offset] ?? undefined;
  }

  handleCloseRequest = () => {
    this.setState({ isOpen: false });
  };

  handleMovePrevRequest = () => {
    this.setState({
      currentIndex: this.state.currentIndex - 1,
    });
  };

  handleMoveNextRequest = () => {
    this.setState({
      currentIndex: this.state.currentIndex + 1,
    });
  };

  render() {
    return (
      <div className="image-viewer" onClick={() => this.handleClick()}>
        {this.props.children}
        {this.props.originImageUrl && this.state.isOpen && (
          <Lightbox
            mainSrc={this.getImageUrlByOffset(0)}
            prevSrc={this.getImageUrlByOffset(-1)}
            nextSrc={this.getImageUrlByOffset(+1)}
            imageLoadErrorMessage="图片加载失败"
            onCloseRequest={this.handleCloseRequest}
            onMovePrevRequest={this.handleMovePrevRequest}
            onMoveNextRequest={this.handleMoveNextRequest}
          />
        )}
      </div>
    );
  }
}

export default ImageViewer;
