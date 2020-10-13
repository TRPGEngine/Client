import tinycon from 'tinycon';
import { getUserInfoCache } from '../../shared/utils/cache-helper';
import config from '@src/shared/project.config';
import { switchMenuPannel } from '../../shared/redux/actions/ui';
import { switchConverse } from '../../shared/redux/actions/chat';
import _get from 'lodash/get';
import { TRPGStore } from '@redux/types/__all__';

/**
 * 设置小红点
 * @param num 小红点数
 */
let bubbleNum = 0;
function setBubble(num: number) {
  bubbleNum = num;
  if (num < 0) {
    num = 0;
  }
  tinycon.setBubble(num >= 100 ? 99 : num);
}

const hiddenProperty =
  'hidden' in document
    ? 'hidden'
    : 'webkitHidden' in document
    ? 'webkitHidden'
    : 'mozHidden' in document
    ? 'mozHidden'
    : null;
const visibilityChangeEvent = hiddenProperty?.replace(
  /hidden/i,
  'visibilitychange'
);
const onVisibilityChange = function () {
  if (!document[hiddenProperty ?? '']) {
    // 显示标签页时清空
    tinycon.setBubble(0);
  } else {
    // 隐藏标签页
  }
};
if (typeof visibilityChangeEvent === 'string') {
  document.addEventListener(visibilityChangeEvent, onVisibilityChange); // TODO: 需要在electron环境下测试是否可以运行
}

export default function (store: TRPGStore) {
  // 通过blur事件处理浏览器不是当前激活窗口的情况
  let isBlur = false;
  window.addEventListener('focus', () => {
    setBubble(0); // 点击时清空
    isBlur = false;
  });
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
        if (allowNotify && Notification.permission === 'granted') {
          // TODO: 这里在华为手机上会报个错误
          // Failed to construct 'Notification': Illegal constructor. Use ServiceWorkerRegistration.showNotification() instead.
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

          notification.onclick = function () {
            window.focus();
            store.dispatch(switchMenuPannel(0));
            store.dispatch(switchConverse(this.data.uuid));
          };
        }

        // 增加小红点
        bubbleNum++;
        setBubble(bubbleNum);
      }
    },
  };
}
