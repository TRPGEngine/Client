const React = require('react');
const { connect } = require('react-redux');
const Lightbox = require('react-image-lightbox').default;
const Modal = require('../components/Modal');
const Loading = require('../components/Loading');
const Alert = require('../components/Alert');
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
          ) : null
        }
        <Modal />
        <Loading show={this.props.showLoading} text={this.props.showLoadingText} />
        <Alert />
      </React.Fragment>
    )
  }
}

module.exports = connect(
  state => ({
    showLoading: state.getIn(['ui', 'showLoading']),
    showLoadingText: state.getIn(['ui', 'showLoadingText']),
    showLigthbox: state.getIn(['ui', 'showLigthbox']),
    showLigthboxInfo: state.getIn(['ui', 'showLigthboxInfo']),
  })
)(GlobalUI);
