import React from 'react';
import Lightbox from 'react-image-lightbox';

import './ImageViewer.scss';

interface Props {
  originImageUrl: string;
}
class ImageViewer extends React.PureComponent<Props> {
  state = {
    isOpen: false,
  };

  handleClick() {
    if (this.props.originImageUrl) {
      this.setState({ isOpen: true });
    }
  }

  render() {
    return (
      <div className="image-viewer" onClick={() => this.handleClick()}>
        {this.props.children}
        {this.props.originImageUrl && this.state.isOpen && (
          <Lightbox
            mainSrc={this.props.originImageUrl}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

export default ImageViewer;
