import { request } from '@shared/utils/request';
import Taro from '@tarojs/taro';
import _last from 'lodash/last';

/**
 * 发送一个校验token的请求到服务端
 * 如果校验不通过会由request的拦截器自动跳转到登录页
 * 该检查一般用于表单填写页面防止填了一堆数据后提交失败跳转到登录页的挫败感
 * @param 是否自动跳转。如果为登录页则此值应该为false
 */
export async function checkTaroToken(autoNav = true): Promise<boolean> {
  try {
    await request.post('/player/sso/check');
    return true;
  } catch (err) {
    if (autoNav) {
      // 如果出错则跳转到登录页面
      const currentPages = Taro.getCurrentPages();
      if (currentPages.length === 1) {
        Taro.navigateTo({
          url: `/pages/login/index`,
        });
      } else {
        const lastPage = _last(currentPages);
        Taro.redirectTo({
          url: `/pages/login/index?next=${lastPage?.route ?? ''}`,
        });
      }

      return false;
    }
    throw err;
  }
}
