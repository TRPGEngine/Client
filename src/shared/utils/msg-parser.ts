import parser from './bbcode';

export const preParse = (str: string): string => {
  return str.replace(/:(\w*?):/g, '[emoji]$1[/emoji]');
};

export default function(str: string) {
  return parser.toReact(preParse(str));
}
