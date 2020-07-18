import tinycon from 'tinycon';
import { getUserInfoCache } from '../../shared/utils/cache-helper';
import config from '@src/shared/project.config';
import { switchMenuPannel } from '../../shared/redux/actions/ui';
import { switchConverse } from '../../shared/redux/actions/chat';
import _get from 'lodash/get';
import { TRPGStore } from '@redux/types/__all__';
let num = 0;

const hiddenProperty =
  'hidden' in document
    ? 'hidden'
    : 'webkitHidden' in document
    ? 'webkitHidden'
    : 'mozHidden' in document
    ? 'mozHidden'
    : null;
const visibilityChangeEvent = hiddenProperty.replace(
  /hidden/i,
  'visibilitychange'
);
const onVisibilityChange = function() {
  if (!document[hiddenProperty]) {
    // 显示标签页
    tinycon.setBubble(null);
    num = 0;
  } else {
    // 隐藏标签页
  }
};
document.addEventListener(visibilityChangeEvent, onVisibilityChange); // TODO: 需要在electron环境下测试是否可以运行

export default function(store: TRPGStore) {
  // 通过blur事件处理浏览器不是当前激活窗口的情况
  let isBlur = false;
  window.addEventListener('focus', () => (isBlur = false));
  window.addEventListener('blur', () => (isBlur = true));

  return {
    onReceiveMessage(data) {
      // web||electron通知
      const hidden = _get(window, 'document.hidden', false);
      if (hidden || isBlur) {
        const allowNotify = _get(store.getState(), [
          'settings',
          'system',
          'notification',
        ]);
        if (allowNotify) {
          const uuid = data.sender_uuid;
          const userinfo = getUserInfoCache(data.sender_uuid);
          let username = userinfo.nickname || userinfo.username;
          if (uuid && uuid.substr(0, 4) === 'trpg') {
            username = '系统消息';
          }
          const notification = new Notification(`来自 ${username}:`, {
            body: data.message,
            icon: userinfo.avatar || config.defaultImg.trpgsystem,
            tag: 'trpg-msg',
            renotify: true,
            data: { uuid },
          });

          notification.onclick = function() {
            window.focus();
            store.dispatch(switchMenuPannel(0));
            store.dispatch(switchConverse(this.data.uuid));
          };
        }

        // 增加小红点
        num++;
        tinycon.setBubble(num >= 100 ? 99 : num);
      }
    },
  };
}
