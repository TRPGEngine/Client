/**
 * 示例代码
 */
const exampleLayout = [
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
];

const workingLabel = '无限简版';

export { exampleLayout, workingLabel };
