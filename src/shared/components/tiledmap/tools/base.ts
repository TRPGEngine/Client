import { Position } from '../core/types';
import { DrawContext } from '../core/render';
import { LayerManager } from '../layer/manager';
import { TiledMapManager } from '../core/manager';

export interface ActionContext extends DrawContext {
  manager: TiledMapManager;
  layerManager: LayerManager;
  mousePos: Position; // 鼠标指针在画布dom上的相对位置
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

  // 选择事件
  abstract select(ctx: DrawContext): void;

  // 点击事件
  abstract action(ctx: ActionContext): void;
}
