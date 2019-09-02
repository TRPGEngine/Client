// 为使react-native-storage能够正常运行需要有一个全局的regeneratorRuntime
// 网页端由babel-runtime提供， 而jest使用ts-node解释js文件。而不是使用babel。因此要手动全局引入
import 'regenerator-runtime/runtime';
