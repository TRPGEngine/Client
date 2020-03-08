import { TiledMapToolBase, ActionContext } from './base';
import { DrawContext } from '../core/render';
import {
  px2gridPos,
  pxRect2GridRect,
  getRectWithSize,
  isPositionInsizeRect,
} from '../core/utils';
import { Token } from '../layer/token';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import { Position, Size, Rect } from '../core/types';
import { drawSelectionRect, drawSelectedTokenRect } from '../draw/rect';

type HandlerType = 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom';
interface ClickedHander {
  token: Token;
  type: HandlerType;
}

export class TiledMapToolSelect extends TiledMapToolBase {
  name = 'select';
  desc = '选择指针';
  icon = '&#xe65c;';

  currentTokens: Token[] = [];
  handlerSize = 8;

  drawAlway = (ctx: DrawContext) => {
    if (_isEmpty(this.currentTokens)) {
      return;
    }
    const { gridSize } = ctx;
    const { canvas } = ctx.render;

    for (const token of this.currentTokens) {
      const { gridAreaSize, gridPosition } = token;
      this.drawSelectRect(canvas, gridPosition, gridAreaSize, gridSize);
    }
  };

  /**
   * 绘制选中的线框
   */
  drawSelectRect(
    canvas: CanvasRenderingContext2D,
    gridPosition: Position,
    gridAreaSize: Size,
    gridSize: Size
  ) {
    const rect = {
      x1: gridPosition.x * gridSize.width,
      y1: gridPosition.y * gridSize.height,
      x2: (gridPosition.x + gridAreaSize.width) * gridSize.width,
      y2: (gridPosition.y + gridAreaSize.height) * gridSize.height,
    };
    drawSelectedTokenRect(canvas, rect, this.handlerSize);
  }

  select(ctx: DrawContext): void {
    ctx.el.style.cursor = 'default';
  }

  selectionRect: Rect = null;
  draw = (ctx: DrawContext) => {
    if (!_isNil(this.selectionRect)) {
      const { canvas } = ctx.render;

      drawSelectionRect(canvas, this.selectionRect);
    }
  };

  /**
   * 鼠标点击操作事件
   */
  action(ctx: ActionContext): void {
    const { ratio, mouseCanvasPos, gridSize } = ctx;

    const clickedHandler = this.checkClickAnyHandler(mouseCanvasPos, gridSize);

    if (clickedHandler === false) {
      const selectToken = this.getSelectToken(ctx);
      if (this.currentTokens.includes(selectToken)) {
        // 如果点击到的Token已经被选中. 则视为移动操作
        this.handleMoveAction(ctx);
      } else {
        this.handleNormalAction(ctx);
      }
    } else {
      this.handleResizeAction(ctx, clickedHandler);
    }
  }

  handleNormalAction(ctx: ActionContext) {
    const { el, ratio, mouseCanvasPos, gridSize } = ctx;
    let isMoved = false;

    // 点击以后立刻生成选框
    this.selectionRect = {
      x1: mouseCanvasPos.x,
      y1: mouseCanvasPos.y,
      x2: mouseCanvasPos.x,
      y2: mouseCanvasPos.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      isMoved = true;
      const curPos = ctx.render.transformMousePosToCanvasPos({
        x: e.clientX,
        y: e.clientY,
      });

      this.selectionRect = {
        x1: mouseCanvasPos.x,
        y1: mouseCanvasPos.y,
        x2: curPos.x,
        y2: curPos.y,
      };
      ctx.render.draw();
    };

    const handleMouseUp = (e: MouseEvent) => {
      // 获取选中的Token
      if (!_isNil(this.selectionRect)) {
        if (isMoved) {
          // 框选
          const tokens = ctx.layerManager.getLayerTokenByGridRectRange(
            pxRect2GridRect(this.selectionRect, gridSize)
          );

          this.currentTokens = tokens;
        } else {
          const selectToken = this.getSelectToken(ctx);

          if (_isNil(selectToken)) {
            this.currentTokens = [];
          } else {
            this.currentTokens = [selectToken];
          }
        }
      }

      this.selectionRect = null;
      ctx.render.draw();

      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseenter', handleMouseEnter);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      el.removeEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      el.addEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseenter', handleMouseEnter);
  }

  handleResizeAction(ctx: ActionContext, clickedHandler: ClickedHander) {
    const { el, ratio, mouseCanvasPos, gridSize } = ctx;
    const { token, type: handlerType } = clickedHandler;

    const handleMouseMove = (e: MouseEvent) => {
      const curPos = ctx.render.transformMousePosToCanvasPos({
        x: e.clientX,
        y: e.clientY,
      });
      const targetPos = px2gridPos(curPos, gridSize, true);

      // resize
      if (handlerType === 'rightBottom') {
        token.gridAreaSize = {
          width: targetPos.x - token.gridPosition.x,
          height: targetPos.y - token.gridPosition.y,
        };
      } else if (handlerType === 'rightTop') {
        token.gridAreaSize = {
          height:
            token.gridPosition.y + token.gridAreaSize.height - targetPos.y,
          width: targetPos.x - token.gridPosition.x,
        };
        token.gridPosition = {
          x: token.gridPosition.x,
          y: targetPos.y,
        };
      } else if (handlerType === 'leftTop') {
        token.gridAreaSize = {
          width: token.gridPosition.x + token.gridAreaSize.width - targetPos.x,
          height:
            token.gridPosition.y + token.gridAreaSize.height - targetPos.y,
        };
        token.gridPosition = targetPos;
      } else if (handlerType === 'leftBottom') {
        token.gridAreaSize = {
          width: token.gridPosition.x + token.gridAreaSize.width - targetPos.x,
          height: targetPos.y - token.gridPosition.y,
        };
        token.gridPosition = {
          x: targetPos.x,
          y: token.gridPosition.y,
        };
      }
      ctx.render.draw();
    };

    const handleMouseUp = (e) => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mouseleave', handleMouseUp);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mouseleave', handleMouseUp);
  }

  handleMoveAction(ctx: ActionContext) {
    const { el, gridSize, mouseCanvasPos } = ctx;

    let startPos = px2gridPos(mouseCanvasPos, gridSize);

    const handleMouseMove = (e: MouseEvent) => {
      const curPos = ctx.render.transformMousePosToCanvasPos({
        x: e.clientX,
        y: e.clientY,
      });
      const targetPos = px2gridPos(curPos, gridSize);
      const deltaPos = {
        x: targetPos.x - startPos.x,
        y: targetPos.y - startPos.y,
      };

      for (const token of this.currentTokens) {
        token.gridPosition = {
          x: token.gridPosition.x + deltaPos.x,
          y: token.gridPosition.y + deltaPos.y,
        };
      }

      if (deltaPos.x !== 0 || deltaPos.y !== 0) {
        // 发生了位移。重置起始点
        startPos = px2gridPos(curPos, gridSize);
      }

      ctx.render.draw();
    };

    const handleMouseUp = (e) => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mouseleave', handleMouseUp);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mouseleave', handleMouseUp);
  }

  /**
   * 返回点击到的resize handler点
   */
  checkClickAnyHandler(
    mouseCanvasPos: Position,
    gridSize: Size
  ): ClickedHander | false {
    // 只允许修改1个
    if (this.currentTokens.length !== 1) {
      return false;
    }

    const token = this.currentTokens[0];
    const rect = token.getRealPxRect(gridSize);

    if (
      isPositionInsizeRect(
        mouseCanvasPos,
        getRectWithSize(
          {
            x: rect.x1,
            y: rect.y1,
          },
          {
            width: this.handlerSize,
            height: this.handlerSize,
          }
        )
      )
    ) {
      return {
        token,
        type: 'leftTop',
      };
    } else if (
      isPositionInsizeRect(
        mouseCanvasPos,
        getRectWithSize(
          {
            x: rect.x2,
            y: rect.y1,
          },
          {
            width: this.handlerSize,
            height: this.handlerSize,
          }
        )
      )
    ) {
      return {
        token,
        type: 'rightTop',
      };
    } else if (
      isPositionInsizeRect(
        mouseCanvasPos,
        getRectWithSize(
          {
            x: rect.x1,
            y: rect.y2,
          },
          {
            width: this.handlerSize,
            height: this.handlerSize,
          }
        )
      )
    ) {
      return {
        token,
        type: 'leftBottom',
      };
    } else if (
      isPositionInsizeRect(
        mouseCanvasPos,
        getRectWithSize(
          {
            x: rect.x2,
            y: rect.y2,
          },
          {
            width: this.handlerSize,
            height: this.handlerSize,
          }
        )
      )
    ) {
      return {
        token,
        type: 'rightBottom',
      };
    }

    return false;
  }

  getSelectToken(ctx: ActionContext): Token {
    const { mouseCanvasPos, gridSize } = ctx;
    // 获取当前鼠标选中的Token
    const gridPos = px2gridPos(mouseCanvasPos, gridSize);
    return ctx.layerManager.getLayerTokenByGridPosition({
      x: gridPos.x + 0.5,
      y: gridPos.y + 0.5,
    });
  }
}
