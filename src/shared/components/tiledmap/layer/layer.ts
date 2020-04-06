import { Token } from './token';
import _pull from 'lodash/pull';
import { DrawContext } from '../core/render';
import { LayerAttrs } from '../core/types';
import shortid from 'shortid';

export class Layer {
  private _id: string;
  desc: string;
  tokens: Token[] = [];
  index: number = 0; // 值越高越晚绘制, 显示越在上面

  constructor(public name: string, id?: string) {
    this._id = id ?? shortid.generate();
  }

  get id() {
    return this._id;
  }

  appendToken(token: Token) {
    this.tokens.push(token);
  }

  hasToken(tokenId: string): boolean {
    return this.tokens.findIndex((t) => t.id === tokenId) >= 0;
  }

  getToken(tokenId: string): Token {
    return this.tokens.find((t) => t.id === tokenId);
  }

  removeToken(token: Token) {
    _pull(this.tokens, token);
  }

  /**
   * 绘制层中所有元素
   */
  drawAllToken(ctx: DrawContext) {
    this.tokens.forEach((token) => {
      token.draw(ctx);
    });
  }

  getData() {
    return {
      _id: this._id,
      name: this.name,
      index: this.index,
      desc: this.desc,
    };
  }

  parseData(data: LayerAttrs) {
    this._id = data._id;
    this.name = data.name;
    this.index = data.index;
    this.desc = data.desc;
  }
}
