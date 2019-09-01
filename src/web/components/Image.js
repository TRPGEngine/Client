import React from 'react';
import config from '../../../config/project.config';

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: props.src,
    };
  }

  render() {
    return (
      <img
        {...this.props}
        src={this.state.src}
        onError={() => {
          this.setState({ src: config.defaultImg.chatimg_fail });
        }}
      />
    );
  }
}

export default Image;
