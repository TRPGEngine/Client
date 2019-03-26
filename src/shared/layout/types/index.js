// 这个文件是用于获取与注册所有可用类型
import BaseType from './Base';
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
      getEditView: type.getEditView,
      getDetailView: type.getDetailView,
    },
  });
};

export const get = (name) => {
  const type = _list.find((val) => val.name === name);
  if (type) {
    return type;
  } else {
    const baseType = new BaseType();
    return {
      name: baseType.name,
      render: {
        getEditView: baseType.getEditView,
        getDetailView: baseType.getDetailView,
      },
    };
  }
};
