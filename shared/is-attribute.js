'use strict';
const { matchOrigin, matchWhitelist } = require('./url');

const attributeNameRegexp = /^(?!on)[a-z]+(?:-[a-z]+)*$/i;
const absolutePathRegexp = /^\/(?:[^\/]|$)/;
const httpRegexp = /^https?:\/\//;

const isSafeUrl = url => (
  absolutePathRegexp.test(url)
  || (httpRegexp.test(url) && matchOrigin(url))
  || matchWhitelist(url)
);

module.exports = function (name, value) {
  if (!attributeNameRegexp.test(name)) {
    return false;
  }

  switch (name) {
    case 'style':
      return false;
    case 'href':
    case 'src':
      return isSafeUrl(value);
    default:
      return true;
  }
};
