import React from 'react';
import Lightbox from 'react-image-lightbox';
import Modal from '../components/Modal';
import LoadingScreen from '../components/LoadingScreen';
import Alert from '../components/Alert';
import { hideLightbox } from '../../shared/redux/actions/ui';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import { TMemo } from '@shared/components/TMemo';

const GlobalUI: React.FC = TMemo(() => {
  const showLigthbox = useTRPGSelector((state) => state.ui.showLigthbox);
  const showLigthboxInfo = useTRPGSelector(
    (state) => state.ui.showLigthboxInfo
  );
  const showLoading = useTRPGSelector((state) => state.ui.showLoading);
  const showLoadingText = useTRPGSelector((state) => state.ui.showLoadingText);
  const dispatch = useTRPGDispatch();

  return (
    <React.Fragment>
      {showLigthbox ? (
        <Lightbox
          mainSrc={showLigthboxInfo.src}
          onCloseRequest={() => dispatch(hideLightbox())}
        />
      ) : null}
      <Modal />
      <LoadingScreen show={showLoading} text={showLoadingText} />
      <Alert />
    </React.Fragment>
  );
});
GlobalUI.displayName = 'GlobalUI';
