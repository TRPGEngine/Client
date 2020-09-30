import { TMemo } from '@shared/components/TMemo';
import { PWA_INSTALLED } from '@shared/utils/consts';
import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import _get from 'lodash/get';

interface PWAContextProps {
  pwaInstalled: boolean;
  deferredPromptRef: React.MutableRefObject<any>;
}
const PWAContext = createContext<PWAContextProps>({
  pwaInstalled: false,
  deferredPromptRef: { current: null },
});
PWAContext.displayName = 'PWAContext';

/**
 * PWA相关上下文提供器
 * 需要挂载到应用顶上保证能够立即加载
 */
export const PWAContextProvider = TMemo((props) => {
  const [pwaInstalled, setPwaInstalled] = useState(true); // 默认已安装(即不显示)
  const deferredPromptRef = useRef<any>(null);

  useEffect(() => {
    let installed = localStorage.getItem(PWA_INSTALLED) === 'yes';
    if (window.matchMedia('(display-mode: standalone)').matches) {
      localStorage.setItem(PWA_INSTALLED, 'yes');
      installed = true;
    } else if (_get(window.navigator, 'standalone') === true) {
      localStorage.setItem(PWA_INSTALLED, 'yes');
      installed = true;
    }

    setPwaInstalled(installed);
  }, []);

  useLayoutEffect(() => {
    const beforeinstallprompt = (e) => {
      deferredPromptRef.current = e;
    };
    const appinstalled = (e) => {
      localStorage.setItem(PWA_INSTALLED, 'yes');
      setPwaInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', beforeinstallprompt);
    window.addEventListener('appinstalled', appinstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeinstallprompt);
      window.removeEventListener('appinstalled', appinstalled);
    };
  }, []);

  return (
    <PWAContext.Provider value={{ pwaInstalled, deferredPromptRef }}>
      {props.children}
    </PWAContext.Provider>
  );
});
PWAContextProvider.displayName = 'PWAContextProvider';

export function usePWAContext(): PWAContextProps {
  const status = useContext(PWAContext);

  return status;
}
