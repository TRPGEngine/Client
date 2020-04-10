import { TokenAttrs } from '../../core/types';
import { BaseToken } from './BaseToken';
import { ImageToken } from './ImageToken';
import _get from 'lodash/get';
import { ActorToken } from './ActorToken';

const customToken: { [type: string]: typeof BaseToken } = {};
export function registerCustomToken(
  tokenType: string,
  tokenCls: typeof BaseToken
) {
  customToken[tokenType] = tokenCls;
}

registerCustomToken(ActorToken.TYPE, ActorToken);

/**
 * 根据Token信息创建Token实例
 * @param tokenData Token信息
 */
export function createTokenByData(tokenData: TokenAttrs): BaseToken {
  let newToken: BaseToken;
  const tokenType = tokenData._type;

  if (customToken[tokenType]) {
    const Cls = customToken[tokenType];
    newToken = new Cls(tokenData._id);
  } else if (tokenType === ImageToken.TYPE) {
    newToken = new ImageToken(tokenData._id);
  } else {
    newToken = new BaseToken(tokenData._id);
  }

  newToken.parseData(tokenData);

  return newToken;
}
