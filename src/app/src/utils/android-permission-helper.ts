import { PermissionsAndroid } from 'react-native';
import { logger } from '@shared/api/logger';

// for Android

/**
 * 请求安卓外部存储权限
 */
export const requestExternalStoragePermission = async (): Promise<boolean> => {
  try {
    const check = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    if (check) {
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: '请求读写权限',
        message: 'TRPG Engine 需要访问你的外部存储以保存图片',
        buttonPositive: '好的',
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      logger.info('User agree request permission: WRITE_EXTERNAL_STORAGE');
      return true;
    }

    logger.info('User refush request permission: WRITE_EXTERNAL_STORAGE');
    return false;
  } catch (err) {
    logger.error(
      'Failed to request permission: WRITE_EXTERNAL_STORAGE, error: ',
      err
    );
    return false;
  }
};
