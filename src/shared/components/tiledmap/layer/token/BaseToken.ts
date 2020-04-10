import { Position, Size, Rect, TokenData } from '../../core/types';
import { DrawContext } from '../../core/render';
import _isNumber from 'lodash/isNumber';
import _inRange from 'lodash/inRange';
import { isRectInsideRect } from '../../core/utils';
import shortid from 'shortid';

/**
 * 棋子
 * 原则上来说棋子在画布上的大小必须为网格整数倍
 */
export class BaseToken {
  static TYPE = 'BaseToken';

  private _id: string;
  name: string;
  gridPosition: Position = { x: 0, y: 0 }; // 网格坐标, 0 0 表示网格左上角
  gridAreaSize: Size = { width: 1, height: 1 }; // 当前Token所占据的网格数 所有的Token默认都是1x1 不得为0或负数

  constructor(id?: string) {
    // 如果创建时没有指定id则使用shortid生成一个id
    this._id = id ?? shortid.generate();
  }

  get id() {
    return this._id;
  }

  /**
   * 准备
   * 当外层增加token时会检查token是否准备完毕
   */
  async prepare(): Promise<void> {}

  draw(ctx: DrawContext) {
    throw new Error('Should be Implement');
  }

  /**
   * 判定一个网格点是否在当前Token内部
   */
  checkPosInside(gridPos: Position): boolean {
    if (this.gridAreaSize.width === 0 || this.gridAreaSize.height === 0) {
      // 如果占用面积不存在则直接返回false
      return false;
    }

    if (
      _inRange(
        gridPos.x,
        this.gridPosition.x,
        this.gridPosition.x + this.gridAreaSize.width
      ) &&
      _inRange(
        gridPos.y,
        this.gridPosition.y,
        this.gridPosition.y + this.gridAreaSize.height
      )
    ) {
      return true;
    }

    return false;
  }

  /**
   * 判定当前Token是否完全在矩形范围内
   */
  checkIsInsideRange(range: Rect): boolean {
    const { x, y } = this.gridPosition;
    const { width, height } = this.gridAreaSize;

    return isRectInsideRect(
      {
        x1: x,
        y1: y,
        x2: x + width,
        y2: y + height,
      },
      range
    );
  }

  getRect(): Rect {
    const { gridPosition, gridAreaSize } = this;

    return {
      x1: gridPosition.x,
      x2: gridPosition.x + gridAreaSize.width,
      y1: gridPosition.y,
      y2: gridPosition.y + gridAreaSize.height,
    };
  }

  /**
   * 返回真实范围
   */
  getRealPxRect(gridSize: Size): Rect {
    const rect = this.getRect();

    return {
      x1: rect.x1 * gridSize.width,
      x2: rect.x2 * gridSize.width,
      y1: rect.y1 * gridSize.height,
      y2: rect.y2 * gridSize.height,
    };
  }

  getData(): TokenData {
    return {
      _id: this._id,
      _type: BaseToken.TYPE,
      name: this.name,
      gridPosition: this.gridPosition,
      gridAreaSize: this.gridAreaSize,
    };
  }

  parseData(data: TokenData) {
    this._id = data._id;
    this.name = data.name;
    this.gridPosition = data.gridPosition;
    this.gridAreaSize = data.gridAreaSize;
  }
}
