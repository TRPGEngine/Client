import { getStoreState } from '@redux/configureStore/helper';
import { getWebToken } from '@shared/utils/portal-helper';
import config from '@shared/project.config';
import { NavigationProp } from '@react-navigation/native';
import { TRPGStackParamList } from '@app/types/params';

export async function navPortal(
  stackNavigation: NavigationProp<TRPGStackParamList>,
  url: string
) {
  const portalUrl = config.url.portal;

  const userUUID = getStoreState()?.user.info.uuid;
  const jwt = await getWebToken(userUUID);

  url = url.startsWith(portalUrl) ? url : portalUrl + url;

  // const injectedJavaScript = `location.href.indexOf('${portalUrl}') === 0 && window.localStorage.setItem('jwt', '${jwt}')`;
  const injectedJavaScript = `(function(){
    if(location.href.indexOf('${portalUrl}') !== 0) {
      return;
    }
    let token = window.localStorage.getItem('jwt');
    if(!token || (token && token != '${jwt}')){
      window.localStorage.setItem('jwt', '${jwt}');
      window.location.reload();
    }
  })();`;

  stackNavigation.navigate('Webview', {
    url,
    injectedJavaScript,
  });
}

export function openWebview(
  stackNavigation: NavigationProp<TRPGStackParamList>,
  url: string
) {
  stackNavigation.navigate('Webview', { url });
}
