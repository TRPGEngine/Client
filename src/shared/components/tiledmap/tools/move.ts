import { TiledMapToolBase, ActionContext } from './base';

export class TiledMapToolMove extends TiledMapToolBase {
  name = 'move';
  desc = '移动棋盘';
  icon = '&#xe766;';
  catalog = '';

  action(ctx: ActionContext): void {
    const { el, ratio, mousePos, canvasPos } = ctx;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - mousePos.x;
      const deltaY = e.clientY - mousePos.y;
      ctx.render.setPosition({
        x: canvasPos.x + deltaX * ratio,
        y: canvasPos.y + deltaY * ratio,
      });
      ctx.render.render();
    };

    const handleMouseLeave = (e: MouseEvent) => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', handleMouseLeave);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseLeave);
    el.addEventListener('mouseleave', handleMouseLeave);
  }
}
