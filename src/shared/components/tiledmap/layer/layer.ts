import { BaseToken } from './token/BaseToken';
import _remove from 'lodash/remove';
import _pull from 'lodash/pull';
import { DrawContext } from '../core/render';
import { LayerAttrs } from '../core/types';
import shortid from 'shortid';

export class Layer {
  private _id: string;
  desc?: string;
  tokens: BaseToken[] = [];
  index: number = 0; // 值越高越晚绘制, 显示越在上面

  constructor(public name: string, id?: string) {
    this._id = id ?? shortid.generate();
  }

  get id() {
    return this._id;
  }

  appendToken(token: BaseToken) {
    this.tokens.push(token);
  }

  hasToken(tokenId: string): boolean {
    return this.tokens.findIndex((t) => t.id === tokenId) >= 0;
  }

  getToken(tokenId: string): BaseToken | null {
    return this.tokens.find((t) => t.id === tokenId) ?? null;
  }

  removeTokenById(tokenId: string) {
    _remove(this.tokens, ['id', tokenId]);
  }

  removeToken(token: BaseToken) {
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
