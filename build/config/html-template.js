const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

module.exports = function buildTemplate(context) {
  const hbs = fs.readFileSync(
    path.resolve(__dirname, '../template/index.hbs'),
    { encoding: 'utf8' }
  );
  const t = Handlebars.compile(hbs);

  return t(context);
};
