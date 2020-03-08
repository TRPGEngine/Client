import { Position } from '../core/types';
import { DrawContext, DrawFunction } from '../core/render';
import { LayerManager } from '../layer/manager';
import { TiledMapManager } from '../core/manager';

export interface ActionContext extends DrawContext {
  manager: TiledMapManager;
  layerManager: LayerManager;
  mousePos: Position; // 鼠标指针在画布dom上的相对位置
  mouseCanvasPos: Position; // 鼠标指针在canvas上的位置
}

export abstract class TiledMapToolBase {
  // 工具名 应全局唯一
  abstract name: string;

  // 工具描述
  abstract desc: string;

  // 工具图标 为TRPG Iconfont集的编码名
  abstract icon: string;

  // 工具分类
  catalog: string = '';

  /**
   * 工具类的画布事件 默认不绘制
   * 注意这里有this指向的问题，为了防止歧义直接使用箭头函数
   * 仅工具处于激活状态时才会调用
   */
  draw: DrawFunction = () => {};

  /**
   * 总是绘制的绘制方法
   * 与draw不同的是就算工具不被激活也会渲染
   */
  drawAlway: DrawFunction = null;

  // 选择事件
  abstract select(ctx: DrawContext): void;

  // 点击事件
  abstract action(ctx: ActionContext): void;
}
