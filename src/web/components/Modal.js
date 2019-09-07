import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideModal } from '../../shared/redux/actions/ui';
import './Modal.scss';

class Modal extends React.Component {
  render() {
    let body = '';
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

Modal.propTypes = {
  show: PropTypes.bool,
  body: PropTypes.object,
};

export default connect(
  (state) => ({
    show: state.getIn(['ui', 'showModal']),
    body: state.getIn(['ui', 'showModalBody']),
  }),
  (dispatch) => ({
    hideModal: () => {
      dispatch(hideModal());
    },
  })
)(Modal);
