const { emojify } = require('react-emojione2');
const options = {
  convertShortnames: true,
  convertUnicode: true,
  convertAscii: true,
  styles: {
    backgroundImage: 'url(/src/assets/img/emojione.sprites.png)',
    width: '64px',
    height: '64px',
    margin: '4px'
  },
  // this click handler will be set on every emoji
  // handleClick: event => console.log(event.target.title)
}

module.exports = function(str, opt) {
  return emojify(str, Object.assign({}, opt, options));
}
