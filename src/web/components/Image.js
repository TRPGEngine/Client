const React = require('react');
const config = require('../../../config/project.config.js');

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

module.exports = Image;
