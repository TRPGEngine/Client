const React = require('react');
const PropTypes = require('prop-types');
const Lightbox = require('react-image-lightbox').default;

require('./ImageViewer.scss');

class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  _handleClick() {
    if (this.props.originImageUrl) {
      this.setState({ isOpen: true });
    }
  }

  render() {
    return (
      <div className="image-viewer" onClick={() => this._handleClick()}>
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

module.exports = ImageViewer;
