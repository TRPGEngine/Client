import JPushModule from 'jpush-react-native';

export function init() {
  JPushModule.initPush();
}

export function setAlias(alias) {
  if (alias) {
    JPushModule.setAlias(alias, (success) => {
      console.log('JPush', 'success', success);
    });
  } else {
    console.warn('setAlias failed: alias is required', alias);
  }
}
