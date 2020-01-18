import { Position } from '../core/types';
import { TiledMapRender } from '../core/render';

export interface ActionContext {
  el: HTMLCanvasElement;
  ratio: number;
  canvasPos: Position;
  mousePos: Position;
  render: TiledMapRender;
}

export abstract class TiledMapToolBase {
  // 工具名 应全局唯一
  abstract name: string;

  // 工具描述
  abstract desc: string;

  // 工具图标 为TRPG Iconfont集的编码名
  abstract icon: string;

  // 工具分类
  abstract catalog: string;

  // 点击事件
  abstract action(ctx: ActionContext): void;
}
