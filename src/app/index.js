import { AppRegistry } from 'react-native';
import App from './App';

// 手动进行配置设置
require('../../config/project.config').platform = 'app';

AppRegistry.registerComponent('trpg', () => App);
