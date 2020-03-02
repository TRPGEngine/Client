/**
 * 示例代码
 */
const exampleLayout = [
  { label: 'Simple', value: require('./xml/simple.xml').default },
  { label: 'Grid', value: require('./xml/grid.xml').default },
  { label: 'Input', value: require('./xml/input.xml').default },
  { label: 'Tabs', value: require('./xml/tabs.xml').default },
  { label: 'Display', value: require('./xml/display.xml').default },
  { label: 'Roll', value: require('./xml/roll.xml').default },
  {
    label: 'Use and Define',
    value: require('./xml/use-define.xml').default,
  },
  {
    label: 'Var',
    value: require('./xml/var.xml').default,
  },
  {
    label: 'Function',
    value: require('./xml/function.xml').default,
  },
  {
    label: 'CoC7',
    value: require('./xml/coc7.xml').default,
  },
];

export { exampleLayout };
