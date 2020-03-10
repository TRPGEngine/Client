import React, { useMemo } from 'react';
import { hideModal } from '../../shared/redux/actions/ui';
import './Modal.scss';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import { TMemo } from '@shared/components/TMemo';

const Modal: React.FC = TMemo(() => {
  const modalStack = useTRPGSelector((state) => state.ui.modalStack);
  const dispatch = useTRPGDispatch();

  const body = useMemo(() => {
    return modalStack.map((modal, index) => (
      <div
        key={index}
        className="modal-mask"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-card">
          <div className="modal-close" onClick={() => dispatch(hideModal())}>
            <i className="iconfont">&#xe70c;</i>
          </div>
          <div className="modal-content">{modal}</div>
        </div>
      </div>
    ));
  }, [modalStack, dispatch]);

  return <div className="modal">{body}</div>;
});
Modal.displayName = 'Modal';

export default Modal;
