import { Rect } from '../core/types';

/**
 * 绘制框选的图案
 */
export function drawSelectionRect(
  canvas: CanvasRenderingContext2D,
  rect: Rect
) {
  canvas.lineWidth = 1;
  canvas.strokeStyle = 'rgba(255, 161, 96, 0.8)';
  canvas.fillStyle = 'rgba(255, 161, 96, 0.1)';
  canvas.strokeRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
  canvas.fillRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
}

/**
 * 绘制选择Token的选中框
 */
export function drawSelectedTokenRect(
  canvas: CanvasRenderingContext2D,
  rect: Rect,
  handlerSize: number = 8
) {
  // 绘制线框
  canvas.lineWidth = 3;
  canvas.strokeStyle = 'rgba(255, 161, 96, 0.8)';
  canvas.strokeRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);

  // 绘制修改大小控制器
  const rectSize = handlerSize;
  canvas.lineWidth = 2;
  canvas.fillStyle = 'rgba(255, 161, 96, 0.8)';
  canvas.fillRect(
    rect.x1 - rectSize / 2,
    rect.y1 - rectSize / 2,
    rectSize,
    rectSize
  );
  canvas.fillRect(
    rect.x2 - rectSize / 2,
    rect.y1 - rectSize / 2,
    rectSize,
    rectSize
  );
  canvas.fillRect(
    rect.x1 - rectSize / 2,
    rect.y2 - rectSize / 2,
    rectSize,
    rectSize
  );
  canvas.fillRect(
    rect.x2 - rectSize / 2,
    rect.y2 - rectSize / 2,
    rectSize,
    rectSize
  );
}
