import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import _pull from 'lodash/pull';
import type { TiledMapToolBase } from '../tools/base';
import { regAllTool } from '../tools/__all__';
import type { Size } from './types';
import type { TiledMapManager } from './manager';

export class Toolbox {
  private tools: TiledMapToolBase[] = [];
  private currentToolName = '';
  private containerEl?: HTMLDivElement;

  iconSize: Size = {
    width: 32,
    height: 32,
  };

  constructor(private _manager: TiledMapManager) {
    if (_isNil(_manager.el.parentElement)) {
      console.warn('Cannot render toolbox because of not parent el container');
      return;
    }

    regAllTool(this);
    this.renderDom(_manager.el.parentElement);
  }

  /**
   * 绘制工具箱节点
   */
  renderDom(container: HTMLElement) {
    container.style.position = 'relative';

    // 如果已经创建过了，则先销毁
    this.destoryEl();

    // 容器
    const dom = document.createElement('div');
    dom.className = 'toolbox';

    // 工具项
    for (const tool of this.tools) {
      const { icon, name, desc } = tool;

      const iconContainerEl = document.createElement('div');
      iconContainerEl.className = 'toolbox-item';
      iconContainerEl.setAttribute('data-icon-name', name);
      iconContainerEl.style.width = `${this.iconSize.width}px`;
      iconContainerEl.style.height = `${this.iconSize.height}px`;
      iconContainerEl.title = desc;
      iconContainerEl.onclick = () => {
        this.setCurrentTool(name);
      };

      const iconEl = document.createElement('i');
      iconEl.className = 'iconfont';
      iconEl.innerHTML = icon;

      iconContainerEl.appendChild(iconEl);
      dom.appendChild(iconContainerEl);
    }

    container.appendChild(dom);
    this.containerEl = dom;

    this.updateCurrentToolClass();
  }

  /**
   * 销毁工具箱元素
   */
  destoryEl() {
    if (!_isNil(this.containerEl)) {
      this.containerEl.remove();
    }
  }

  /**
   * 注册工具
   */
  regTool(tool: TiledMapToolBase) {
    this.tools.push(tool);

    if (!_isNil(tool.drawAlway)) {
      this._manager.render.extraDrawFns.push(tool.drawAlway); // 注册工具绘制函数
    }
  }

  /**
   * 设置当前使用的工具
   * @param toolName 工具名
   */
  setCurrentTool(toolName: string) {
    const prevTool = this.getCurrentTool();
    const tool = this.tools.find((t) => t.name === toolName);
    if (_isNil(tool)) {
      return;
    }
    tool.select(this._manager.render.getDrawContext()); // 调用工具的选择事件

    this.currentToolName = toolName;

    this.updateCurrentToolClass();

    if (!_isNil(prevTool)) {
      // 如果上一个工具不为空
      // 将上一个工具的渲染事件清理
      _pull(this._manager.render.extraDrawFns, prevTool.draw);
    }

    this._manager.render.extraDrawFns.push(tool.draw);
  }

  /**
   * 设置当前选中的工具的样式
   * 当前工具图标增加类名 toolbox-item-selected
   * 其他图标移除类名 toolbox-item-selected
   */
  updateCurrentToolClass() {
    if (_isNil(this.containerEl) || _isEmpty(this.currentToolName)) {
      return;
    }

    // 设置样式
    this.containerEl
      .querySelectorAll('.toolbox-item-selected')
      .forEach((item) => item.classList.remove('toolbox-item-selected'));

    this.containerEl
      .querySelector(`.toolbox-item[data-icon-name=${this.currentToolName}]`)
      ?.classList.add('toolbox-item-selected');
  }

  /**
   * 获取当前的工具
   */
  getCurrentTool(): TiledMapToolBase | null {
    return (
      this.tools.find((tool) => tool.name === this.currentToolName) ?? null
    );
  }

  /**
   * 获取当前工具名
   * 用于外部获取
   */
  public getCurrentToolName() {
    return this.currentToolName;
  }
}
