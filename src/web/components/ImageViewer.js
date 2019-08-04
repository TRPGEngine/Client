import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';

import './ImageViewer.scss';

class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

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

ImageViewer.propTypes = {
  originImageUrl: PropTypes.string,
};

export default ImageViewer;
