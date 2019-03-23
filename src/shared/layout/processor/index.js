import types from '../types';

export function render(data, layoutType = 'edit') {
  const { name, attributes, elements } = data;

  let type = types.get(name);

  if (layoutType === 'edit') {
    return type.getEditView(name, attributes, elements);
  } else {
    return type.getDetailView(name, attributes, elements);
  }
}
