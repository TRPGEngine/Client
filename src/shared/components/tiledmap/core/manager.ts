import { TiledMapOptions } from './types';
import { TiledMapRender } from './render';

/**
 * TiledMap统一管理类
 * 包括工具，渲染
 */
export class TiledMapManager {
  public render: TiledMapRender;

  constructor(public el: HTMLCanvasElement, public options: TiledMapOptions) {
    this.render = new TiledMapRender(el, options);
  }
}
