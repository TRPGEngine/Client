export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}
export type Axios = Position;

export interface TiledMapOptions {
  size: Size; // 格子数
  gridSize: Size;
  ratio?: number; // 绘制精度, 越大越精细但是消耗资源越高
  axis?: {
    padding: Axios;
  };
}

export interface Rect {
  x1: number; // 左上角x
  y1: number; // 左上角y
  x2: number; // 右上角x
  y2: number; // 右上角y
}
