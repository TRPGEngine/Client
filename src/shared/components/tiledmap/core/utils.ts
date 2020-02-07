import { Size, Position } from './types';

/**
 * 计算距离数最近的网格点
 * @param number 真实位置
 * @param gridSizeNum 网格大小
 */
function calcPx2GridMagnetNum(number: number, gridSizeNum: number): number {
  return Math.round(number / gridSizeNum);
}

/**
 * 计算距离数最左上角的点
 * @param number
 * @param gridSizeNum
 */
function calcPx2GridFloorNum(number: number, gridSizeNum: number): number {
  return Math.floor(number / gridSizeNum);
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
