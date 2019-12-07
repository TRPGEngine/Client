// 为使react-native-storage能够正常运行需要有一个全局的regeneratorRuntime
// 网页端由babel-runtime提供， 而jest使用ts-node解释js文件。而不是使用babel。因此要手动全局引入
import 'regenerator-runtime/runtime';

// enzyme react 支持
import { configure, ShallowWrapper, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

// enzyme-to-json
import { Json, shallowToJson, mountToJson, Options } from 'enzyme-to-json';
declare module 'enzyme' {
  class CommonWrapper {
    toJson(): Json;
  }
}

ShallowWrapper.prototype.toJson = function(options?: Options) {
  return shallowToJson(this, options);
};
ReactWrapper.prototype.toJson = function(options?: Options) {
  return mountToJson(this, options);
};
