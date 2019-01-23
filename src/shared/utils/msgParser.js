const parser = require('./bbcode');

module.exports = function(str) {
  str = str.replace(/:(\S*?):/g, '[emoji]$1[/emoji]');

  return parser.toReact(str);
};
