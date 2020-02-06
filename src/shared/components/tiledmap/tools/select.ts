import { TiledMapToolBase, ActionContext } from './base';
import { DrawContext } from '../core/render';
import { px2gridPos } from '../core/utils';
import { Token } from '../layer/token';
import _isNil from 'lodash/isNil';

export class TiledMapToolSelect extends TiledMapToolBase {
  name = 'select';
  desc = '选择指针';
  icon = '&#xe65c;';

  currentToken: Token = null;

  drawAlway = (ctx: DrawContext) => {
    if (_isNil(this.currentToken)) {
      return;
    }

    const { gridAreaSize, gridPosition } = this.currentToken;
    const { gridSize } = ctx;
    const { canvas } = ctx.render;

    // 绘制线框
    canvas.lineWidth = 3;
    canvas.strokeStyle = 'rgba(255, 161, 96, 0.8)';
    canvas.strokeRect(
      gridPosition.x * gridSize.width,
      gridPosition.y * gridSize.height,
      gridAreaSize.width * gridSize.width,
      gridAreaSize.height * gridSize.height
    );
  };

  select(ctx: DrawContext): void {
    ctx.el.style.cursor = 'default';
  }

  action(ctx: ActionContext): void {
    const position = ctx.render.transformMousePosToCanvasPos(ctx.mousePos); // 鼠标指向位置在画布上的坐标
    const gridPos = px2gridPos(position, ctx.gridSize);

    const selectToken = ctx.layerManager.getLayerTokenByGridPosition({
      x: gridPos.x + 0.5,
      y: gridPos.y + 0.5,
    });

    console.log('selectToken', selectToken);
    if (_isNil(selectToken)) {
      return;
    }
    this.currentToken = selectToken;
    ctx.render.draw();

    // TODO: 绘制选择范围
  }
}
