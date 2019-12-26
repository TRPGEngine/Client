import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { hideLightbox } from '../../shared/redux/actions/ui';
import { TRPGState } from '@redux/types/__all__';

interface Props extends DispatchProp<any> {
  showLigthbox: boolean;
  showLigthboxInfo: any;
  showLoading: boolean;
  showLoadingText: string;
}
class GlobalUI extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        {this.props.showLigthbox ? (
          <Lightbox
            mainSrc={this.props.showLigthboxInfo.src}
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

export default connect((state: TRPGState) => ({
  showLoading: state.ui.showLoading,
  showLoadingText: state.ui.showLoadingText,
  showLigthbox: state.ui.showLigthbox,
  showLigthboxInfo: state.ui.showLigthboxInfo,
}))(GlobalUI);
