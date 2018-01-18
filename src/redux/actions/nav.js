const {
  SWITCH_NAV
} = require('../constants');

exports.switchNav = function switchNav(routeName) {
  return {type: SWITCH_NAV, routeName}
}
