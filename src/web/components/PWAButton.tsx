import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import _get from 'lodash/get';
import { usePWAContext } from './PWAContext';
import pwaButtonImgUrl from '@web/assets/img/pwa-logo.svg';

const Button = styled.div`
  padding: 8px 16px;
  display: inline-flex;
  border-radius: 32px;
  text-align: center;
  cursor: pointer;
  background-color: rgb(239, 239, 239);

  img {
    height: 16px;
  }
`;

/**
 * PWA相关按钮
 * 仅会在chrome中出现
 */
export const PWAButton: React.FC = TMemo((props) => {
  const { pwaInstalled, deferredPromptRef } = usePWAContext();

  const handleInstallPWA = useCallback(() => {
    const deferredPrompt = deferredPromptRef.current;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(({ outcome }) => {
        if (outcome === 'accepted') {
          console.log('Your PWA has been installed');
        } else {
          console.log('User chose to not install your PWA');
        }
        deferredPromptRef.current = null;
      });
    }
  }, []);

  if (pwaInstalled === true) {
    return null;
  }

  return (
    <Button onClick={handleInstallPWA}>
      <img src={pwaButtonImgUrl} />
    </Button>
  );
});
PWAButton.displayName = 'PWAButton';
