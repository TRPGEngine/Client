import React from 'react';
import Lightbox from 'react-image-lightbox';
import GlobalModal from '../components/GlobalModal';
import LoadingScreen from '../components/LoadingScreen';
import GlobalAlert from '../components/GlobalAlert';
import { hideLightbox } from '../../shared/redux/actions/ui';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import { TMemo } from '@shared/components/TMemo';

export const GlobalUI: React.FC = TMemo(() => {
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
      <GlobalModal />
      <LoadingScreen show={showLoading} text={showLoadingText} />
      <GlobalAlert />
    </React.Fragment>
  );
});
GlobalUI.displayName = 'GlobalUI';
