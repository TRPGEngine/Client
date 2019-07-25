import { Map } from 'immutable';
import TAlert from '../components/TApi/TAlert';
import { Dispatch } from 'redux';
import { hideAlert } from '@redux/actions/ui';

type UIMap = Map<string, any>;
interface FactoryOptions {
  onEnabled?: (currentUIState: UIMap, dispatch: Dispatch) => void;
  onDisabled?: (currentUIState: UIMap, dispatch: Dispatch) => void;
}

/**
 * 生成监听state ui状态变化的函数
 * @param variable 监听的变量
 * @param option 配置
 */
export const uiStateSwitchFactory = (
  variable: string,
  option: FactoryOptions
) => {
  return (prevUI: UIMap, currentUI: UIMap, dispatch: Dispatch) => {
    if (prevUI.get(variable) === false && currentUI.get(variable) === true) {
      // UI打开
      option.onEnabled && option.onEnabled(currentUI, dispatch);
    }

    if (prevUI.get(variable) === true && currentUI.get(variable) === false) {
      // UI关闭
      option.onDisabled && option.onDisabled(currentUI, dispatch);
    }
  };
};

/**
 * Alert处理
 */
export const alertHandler = uiStateSwitchFactory('showAlert', {
  onEnabled: (currentUI, dispatch) => {
    TAlert.show(currentUI.get('showAlertInfo'), {
      onRequestClose: () => dispatch(hideAlert()),
    });
  },
  onDisabled: () => {
    TAlert.hide();
  },
});
