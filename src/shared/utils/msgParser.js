import parser from './bbcode';

export default function(str) {
  str = str.replace(/:(\S*?):/g, '[emoji]$1[/emoji]');

  return parser.toReact(str);
}
