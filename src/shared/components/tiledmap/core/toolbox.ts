import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import { TiledMapToolBase } from '../tools/base';
import { regAllTool } from '../tools/__all__';
import { Size } from './types';
import { TiledMapManager } from './manager';

export class Toolbox {
  private tools: TiledMapToolBase[] = [];
  private currentTool = '';
  private containerEl: HTMLDivElement;

  iconSize: Size = {
    width: 32,
    height: 32,
  };

  constructor(private _manager: TiledMapManager) {
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
      const { icon, name } = tool;

      const iconContainerEl = document.createElement('div');
      iconContainerEl.className = 'toolbox-item';
      iconContainerEl.setAttribute('data-icon-name', name);
      iconContainerEl.style.width = `${this.iconSize.width}px`;
      iconContainerEl.style.height = `${this.iconSize.height}px`;
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
  }

  /**
   * 设置当前使用的工具
   * @param toolName 工具名
   */
  setCurrentTool(toolName: string) {
    const tool = this.tools.find((t) => t.name === toolName);
    tool.select(this._manager.render.getDrawContext()); // 调用工具的选择事件

    this.currentTool = toolName;

    this.updateCurrentToolClass();
  }

  /**
   * 设置当前选中的工具的样式
   * 当前工具图标增加类名 toolbox-item-selected
   * 其他图标移除类名 toolbox-item-selected
   */
  updateCurrentToolClass() {
    if (_isNil(this.containerEl) || _isEmpty(this.currentTool)) {
      return;
    }

    // 设置样式
    this.containerEl
      .querySelectorAll('.toolbox-item-selected')
      .forEach((item) => item.classList.remove('toolbox-item-selected'));

    this.containerEl
      .querySelector(`.toolbox-item[data-icon-name=${this.currentTool}]`)
      .classList.add('toolbox-item-selected');
  }

  /**
   * 获取当前的工具
   */
  getCurrentTool(): TiledMapToolBase | null {
    return this.tools.find((tool) => tool.name === this.currentTool);
  }
}
