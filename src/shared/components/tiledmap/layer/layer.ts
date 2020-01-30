import { Token } from './token';
import _remove from 'lodash/remove';
import { DrawContext } from '../core/render';

export class Layer {
  desc: string;
  tokens: Token[] = [];
  index: number = 0; // 值越高越晚绘制, 显示越在上面

  constructor(public name: string) {}

  appendToken(token: Token) {
    this.tokens.push(token);
  }

  removeToken(tokenName: string) {
    _remove(this.tokens, (token) => token.name === tokenName);
  }

  /**
   * 绘制层中所有元素
   */
  drawAllToken(ctx: DrawContext) {
    this.tokens.forEach((token) => {
      token.draw(ctx);
    });
  }
}
