/**
 * 示例代码
 */
import config from '@shared/project.config';

const completedLayout = [
  { label: '简单示例', value: require('./xml/simple.xml').default },
  { label: '网格布局', value: require('./xml/grid.xml').default },
  { label: '输入', value: require('./xml/input.xml').default },
  { label: '标签页', value: require('./xml/tabs.xml').default },
  { label: '显示', value: require('./xml/display.xml').default },
  { label: '投骰', value: require('./xml/roll.xml').default },
  {
    label: '模板与复用',
    value: require('./xml/use-define.xml').default,
  },
  {
    label: '变量',
    value: require('./xml/var.xml').default,
  },
  {
    label: '方法',
    value: require('./xml/function.xml').default,
  },
  {
    label: 'CoC7',
    value: require('./xml/coc7.xml').default,
  },
  {
    label: '无限简版',
    value: require('./xml/wuxian-simple.xml').default,
  },
  {
    label: 'DND 5e',
    value: require('./xml/dnd5e.xml').default,
  },
];

// 正在开发中的布局。不会再正式环境显示到界面上
const developLayout = [];

// 正在操作的布局。 在开发模式下会自动加载最新的该布局
const workingLabel = 'DND 5e';
const showDevLayout =
  config.environment === 'development' ||
  localStorage.getItem('__playground_dev') === '1';

const exampleLayout = [
  ...completedLayout,
  ...(showDevLayout ? developLayout : []),
];

export { exampleLayout, workingLabel };

export const initCode = `<?xml version="1.0" encoding="utf-8" ?>
<Template>
  <!-- 在此处输入你的布局 -->

</Template>
`;
