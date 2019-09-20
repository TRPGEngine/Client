import parser from './bbcode';

export const preParse = (str: string): string => {
  return str.replace(/:(\S*?):/g, '[emoji]$1[/emoji]');
};

export default function(str) {
  return parser.toReact(preParse(str));
}
