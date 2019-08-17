import tinycon from 'tinycon';
import { getUserInfoCache } from '../../shared/utils/cache-helper';
import config from '../../../config/project.config.js';
import { switchMenuPannel } from '../../redux/actions/ui';
import { switchConverse } from '../../redux/actions/chat';
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

export default function(store) {
  return {
    onReceiveMessage: function(data) {
      // web||electron通知
      if (window.document && document.hidden) {
        let isNotify = store
          .getState()
          .getIn(['settings', 'system', 'notification']);
        if (isNotify) {
          let uuid = data.sender_uuid;
          let userinfo = getUserInfoCache(data.sender_uuid);
          let username = userinfo.get('nickname') || userinfo.get('username');
          if (uuid && uuid.substr(0, 4) === 'trpg') {
            username = '系统消息';
          }
          let notification = new Notification(`来自 ${username}:`, {
            body: data.message,
            icon: userinfo.get('avatar') || config.defaultImg.trpgsystem,
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
