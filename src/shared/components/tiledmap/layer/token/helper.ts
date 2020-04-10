import { TokenAttrs } from '../../core/types';
import { BaseToken } from './BaseToken';
import { ImageToken } from './ImageToken';
import _get from 'lodash/get';

/**
 * 根据Token信息创建Token实例
 * @param tokenData Token信息
 */
export function createTokenByData(tokenData: TokenAttrs): BaseToken {
  let newToken: BaseToken;
  const tokenType = tokenData._type;
  if (tokenType === ImageToken.TYPE) {
    newToken = new ImageToken(_get(tokenData, 'imageSrc'), tokenData._id);
  } else {
    newToken = new BaseToken(tokenData._id);
  }

  newToken.parseData(tokenData);

  return newToken;
}
