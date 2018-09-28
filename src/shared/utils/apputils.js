import Toast from 'react-native-root-toast';

module.exports = {
  // 用于全局，一般情况下使用组件形式：<TToast />
  toast: function(message, options) {
    let toast = Toast.show(message, Object.assign({}, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: false,
      animation: true,
      backgroundColor: 'rgba(0,0,0,0.8)',
      hideOnPress: true,
    }, options));

    return {
      element: toast,
      hide: () => Toast.hide(toast),
    };
  }
}
