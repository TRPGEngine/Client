import constants from '@shared/redux/constants';
import TAlert from '@app/components/TApi/TAlert';
import { hideAlert, hideModal } from '@redux/actions/ui';
import { Toast, Portal } from '@ant-design/react-native';
import { TRPGMiddleware } from '@redux/types/__all__';
import TModal from '@app/components/TApi/TModal';
const {
  SHOW_ALERT,
  HIDE_ALERT,
  SHOW_MODAL,
  HIDE_MODAL,
  SHOW_TOAST,
  HIDE_TOAST,
} = constants;

let currentToastKey: number = 0;

/**
 * 一个用于监听redux的变更来处理UI变更的中间件
 */
export const appUIMiddleware: TRPGMiddleware = ({ dispatch, getState }) => (
  next
) => (action) => {
  switch (action.type) {
    case SHOW_ALERT:
      TAlert.show(action.payload, {
        onRequestClose: () => dispatch(hideAlert()),
      });
      return;
    case HIDE_ALERT:
      TAlert.hide();
      return;
    case SHOW_TOAST:
      if (currentToastKey > 0) {
        // 如果已存在Toast, 先把之前的移除
        Portal.remove(currentToastKey);
      }
      currentToastKey = Toast.show(action.text, 0);
      return;
    case HIDE_TOAST:
      Portal.remove(currentToastKey);
      currentToastKey = 0;
      return;
    case SHOW_MODAL:
      TModal.show(action.payload, {
        onRequestClose: () => dispatch(hideModal()),
      });
      return;
    case HIDE_MODAL:
      TModal.hide();
      return;
    default:
      break;
  }

  next(action);
};
