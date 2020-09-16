import { getCurrentStore } from '@redux/configureStore/helper';
import config from '@shared/project.config';
import { NavigationProp, StackActions } from '@react-navigation/native';
import { TRPGStackParamList, ChatType } from '@app/types/params';
import _isNil from 'lodash/isNil';
import { switchConverse } from '@redux/actions/chat';
import { switchSelectGroup } from '@redux/actions/group';
import { getUserJWT } from '@shared/utils/jwt-helper';

export async function navPortal(
  stackNavigation: NavigationProp<TRPGStackParamList>,
  url: string
) {
  const portalUrl = config.url.portal;

  const jwt = await getUserJWT();

  url = url.startsWith(portalUrl) ? url : portalUrl + url;

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

export function switchToChatScreen(
  stackNavigation: NavigationProp<TRPGStackParamList>,
  uuid: string,
  type: ChatType,
  name: string
) {
  const store = getCurrentStore();

  if (!_isNil(store)) {
    // TODO: 这里应当被废弃
    // switchConverse和switchSelectGroup不应当是一个通用的状态
    store.dispatch(switchConverse(uuid));
    if (type === 'group') {
      // 如果为团则设定当前选择的团
      store.dispatch(switchSelectGroup(uuid));
    } else {
      store.dispatch(switchSelectGroup(''));
    }
  }

  if (stackNavigation.canGoBack()) {
    stackNavigation.dispatch(StackActions.popToTop());
  }
  stackNavigation.navigate('Chat', {
    uuid,
    type,
    name,
  });
}

/**
 * 打开一个新的页面来选择用户
 * @param allUUIDList 所有的UUID列表
 * @param callback 回调
 * @param extraParams 其他参数
 */
export function selectUser(
  stackNavigation: NavigationProp<TRPGStackParamList>,
  allUUIDList: string[],
  callback: (selectedUUID: string[]) => void,
  extraParams?: {
    title?: string;
  }
) {
  stackNavigation.navigate('UserSelect', {
    uuids: allUUIDList,
    onSelected: callback,
    ...extraParams,
  });
}

/**
 * 关闭所有页面返回到主屏幕
 * @param stackNavigation stack导航器
 */
export function backToTop(stackNavigation: NavigationProp<TRPGStackParamList>) {
  stackNavigation.dispatch(StackActions.popToTop());
}
