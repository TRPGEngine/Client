import { TiledMapToolBase, ActionContext } from './base';
import { DrawContext } from '../core/render';
import { px2gridPos } from '../core/utils';

export class TiledMapToolSelect extends TiledMapToolBase {
  name = 'select';
  desc = '选择指针';
  icon = '&#xe65c;';

  select(ctx: DrawContext): void {
    ctx.el.style.cursor = 'default';
  }

  action(ctx: ActionContext): void {
    const relativePos = {
      x: ctx.mousePos.x - ctx.canvasPos.x,
      y: ctx.mousePos.y - ctx.canvasPos.y,
    }; // 鼠标指向位置在画布上的坐标
    const gridPos = px2gridPos(relativePos, ctx.gridSize);

    const selectToken = ctx.layerManager.getLayerTokenByGridPosition({
      x: gridPos.x + 0.5,
      y: gridPos.y + 0.5,
    });

    // TODO
    console.log('selectToken', selectToken);
  }
}
