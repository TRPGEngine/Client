import React from 'react';
import { connect } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { hideLightbox } from '../../redux/actions/ui';

class GlobalUI extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.showLigthbox ? (
          <Lightbox
            mainSrc={this.props.showLigthboxInfo.get('src')}
            onCloseRequest={() => this.props.dispatch(hideLightbox())}
          />
        ) : null}
        <Modal />
        <Loading
          show={this.props.showLoading}
          text={this.props.showLoadingText}
        />
        <Alert />
      </React.Fragment>
    );
  }
}

export default connect((state) => ({
  showLoading: state.getIn(['ui', 'showLoading']),
  showLoadingText: state.getIn(['ui', 'showLoadingText']),
  showLigthbox: state.getIn(['ui', 'showLigthbox']),
  showLigthboxInfo: state.getIn(['ui', 'showLigthboxInfo']),
}))(GlobalUI);
