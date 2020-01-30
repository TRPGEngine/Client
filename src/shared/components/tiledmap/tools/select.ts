import { TiledMapToolBase, ActionContext } from './base';
import { DrawContext } from '../core/render';

export class TiledMapToolSelect extends TiledMapToolBase {
  name = 'select';
  desc = '选择指针';
  icon = '&#xe65c;';

  select(ctx: DrawContext): void {
    ctx.el.style.cursor = 'default';
  }

  action(ctx: ActionContext): void {
    // TODO
    throw new Error('Method not implemented.');
  }
}
