import type { Size, Position, Rect } from './types';

/**
 * 计算距离数最近的网格点
 * @param num 真实位置
 * @param gridSizeNum 网格大小
 */
function calcPx2GridMagnetNum(num: number, gridSizeNum: number): number {
  return Math.round(num / gridSizeNum);
}

/**
 * 计算距离数最左上角的点
 * @param num
 * @param gridSizeNum
 */
function calcPx2GridFloorNum(num: number, gridSizeNum: number): number {
  return Math.floor(num / gridSizeNum);
}

/**
 * 像素位置转网格位置
 */
export function px2gridPos(
  pos: Position,
  gridSize: Size,
  isMagnet: boolean = false
): Position {
  const calcFn = isMagnet ? calcPx2GridMagnetNum : calcPx2GridFloorNum;

  return {
    x: calcFn(pos.x, gridSize.width),
    y: calcFn(pos.y, gridSize.height),
  };
}

/**
 * 标准化Rect
 */
export function normalizeRect(rect: Rect): Rect {
  return {
    x1: Math.min(rect.x1, rect.x2),
    y1: Math.min(rect.y1, rect.y2),
    x2: Math.max(rect.x1, rect.x2),
    y2: Math.max(rect.y1, rect.y2),
  };
}

/**
 * 判断rect1是否在rect2中
 */
export function isRectInsideRect(rect1: Rect, rect2: Rect) {
  rect1 = normalizeRect(rect1);
  rect2 = normalizeRect(rect2);

  return (
    rect1.x1 >= rect2.x1 &&
    rect1.x2 <= rect2.x2 &&
    rect1.y1 >= rect2.y1 &&
    rect1.y2 <= rect2.y2
  );
}

/**
 * 将pxRect转化成gridRect
 * 算法是网里缩
 */
export function pxRect2GridRect(rect: Rect, gridSize: Size): Rect {
  rect = normalizeRect(rect);

  return {
    x1: Math.ceil(rect.x1 / gridSize.width),
    y1: Math.ceil(rect.y1 / gridSize.height),
    x2: Math.floor(rect.x2 / gridSize.width),
    y2: Math.floor(rect.y2 / gridSize.height),
  };
}

/**
 * 判断一个点是否在一个矩形空间内
 */
export function isPositionInsizeRect(pos: Position, rect: Rect): boolean {
  rect = normalizeRect(rect);

  return (
    pos.x <= rect.x2 && pos.x >= rect.x1 && pos.y <= rect.y2 && pos.y >= rect.y1
  );
}

/**
 * 根据宽高和中心点返回一个矩形
 */
export function getRectWithSize(pos: Position, size: Size): Rect {
  return {
    x1: pos.x - size.width / 2,
    y1: pos.y - size.height / 2,
    x2: pos.x + size.width / 2,
    y2: pos.y + size.height / 2,
  };
}
