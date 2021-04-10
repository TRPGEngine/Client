import React, { useMemo } from 'react';
import { hideModal } from '../../shared/redux/actions/ui';
import { useTRPGSelector, useTRPGDispatch } from '@redux/hooks/useTRPGSelector';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';

const ModalRoot = styled.div`
  .modal-mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 100;

    .modal-card {
      border-radius: 3px;
      overflow: hidden;
      background-color: white;
      text-align: center;
      box-shadow: rgba(0, 0, 0, 0.15) 1px 4px 12px;
      /* min-width: 375px;
      min-height: 375px; */
      max-width: 100%;
      max-height: 100%;
      display: flex;
      position: relative;

      .modal-content {
        flex: 1;
      }

      .modal-close {
        position: absolute;
        right: 10px;
        top: 14px;
        cursor: pointer;
        z-index: 1;

        .iconfont {
          font-size: 21px;
          color: ${(props) =>
            props.theme.mixins.modeValue([
              'rgba(0, 0, 0, 0.2)',
              'rgba(255, 255, 255, 0.6)',
            ])};
          line-height: 1em;
          display: block;
          transition: all 0.2s ease-in-out;

          &:hover {
            color: ${(props) =>
              props.theme.mixins.modeValue([
                'rgba(0, 0, 0, 0.6)',
                'rgba(255, 255, 255, 0.8)',
              ])};
          }
        }
      }
    }
  }
`;

const GlobalModal: React.FC = TMemo(() => {
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

  return <ModalRoot>{body}</ModalRoot>;
});
GlobalModal.displayName = 'GlobalModal';

export default GlobalModal;
