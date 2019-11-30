/**
 * 弃用
 */

const fs = require('fs');
const _ = require('lodash');
const commitFile = process.env['HUSKY_GIT_PARAMS'];
const allowScope = require('./lib/allow-scope');
const allowTag = require('./lib/allow-tag');
const re = new RegExp(
  `:(${allowTag.join('|')}): \\[(${allowScope.join('|')})\\] .*?`
);

const msg = fs.readFileSync(commitFile, {
  encoding: 'utf-8',
});
const firstLine = _.trim(_.head(msg.split('\n')));
const tipCommitFormat = `
${firstLine}

————————————————————

你的提交不合法, 推荐的提交格式:
    :tag: [scope] any string

允许的tag:
  ${allowTag.join(', ')}
允许的scope:
  ${allowScope.join(', ')}
`;

if (!re.test(firstLine)) {
  console.log(tipCommitFormat);
  process.exit(1);
}
