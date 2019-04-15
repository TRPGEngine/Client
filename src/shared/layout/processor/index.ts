import * as types from '../types';

export function render(data, context, layoutType = 'edit') {
  const { type, name, attributes, elements } = data;

  // 仅渲染元素类型与文本类型与根节点
  if (!(type === 'element' || type === 'text' || type === 'root')) {
    return;
  }

  let _type = types.get(name);

  if (layoutType === 'edit') {
    return _type.getEditView(name, attributes, elements, context);
  } else {
    return _type.getDetailView(name, attributes, elements, context);
  }
}

export default {
  render,
};
