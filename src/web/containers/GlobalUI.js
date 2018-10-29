const React = require('react');
const { connect } = require('react-redux');
const Lightbox = require('react-image-lightbox').default;
const { hideLightbox } = require('../../redux/actions/ui');

class GlobalUI extends React.Component {
  render() {
    return (
      <React.Fragment>
        {
          this.props.showLigthbox ? (
            <Lightbox
              mainSrc={this.props.showLigthboxInfo.get('src')}
              onCloseRequest={() => this.props.dispatch(hideLightbox())}
            />
          )
        }
      </React.Fragment>
    )
  }
}

module.exports = connect(
  state => ({
    showLigthbox: state.getIn(['ui', 'showLigthbox']),
    showLigthboxInfo: state.getIn(['ui', 'showLigthboxInfo']),
  })
)(GlobalUI);
