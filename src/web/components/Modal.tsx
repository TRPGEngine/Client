import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { hideModal } from '../../shared/redux/actions/ui';
import './Modal.scss';
import { TRPGState, TRPGDispatch } from '@redux/types/__all__';

interface Props {
  show: boolean;
  body: any;
  hideModal: () => void;
}
class Modal extends React.Component<Props> {
  render() {
    let body: ReactNode = '';
    if (this.props.show && this.props.body) {
      body = (
        <div className="modal-mask" onClick={(e) => e.stopPropagation()}>
          <div className="modal-card">
            <div className="modal-close" onClick={() => this.props.hideModal()}>
              <i className="iconfont">&#xe70c;</i>
            </div>
            <div className="modal-content">{this.props.body.toJS()}</div>
          </div>
        </div>
      );
    }

    return <div className="modal">{body}</div>;
  }
}

export default connect(
  (state: TRPGState) => ({
    show: state.ui.showModal,
    body: state.ui.showModalBody,
  }),
  (dispatch: TRPGDispatch) => ({
    hideModal: () => {
      dispatch(hideModal());
    },
  })
)(Modal);
