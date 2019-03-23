// 这个文件是用于获取与注册所有可用类型

const _list = [];

export const register = (Type) => {
  const type = new Type();
  const name = type.name;
  const isExist = _list.findIndex((val) => val.name === name);
  if (isExist >= 0) {
    return;
  }

  _list.push({
    name: type.name,
    render: {
      getEditorView: type.getEditorView,
      getDetailView: type.getDetailView,
    },
  });
};

export const get = (name) => {
  return _list.find((val) => val.name === name);
};
