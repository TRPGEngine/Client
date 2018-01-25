const {
  SWITCH_NAV,
  REPLACE_NAV,
} = require('../constants');

exports.switchNav = function switchNav(routeName) {
  return {type: SWITCH_NAV, routeName}
}

exports.replaceNav = function switchNav(routeName) {
  return {type: REPLACE_NAV, routeName}
}
