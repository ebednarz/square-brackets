'use strict';
const { setOrigin, setWhitelist } = require('./url');

module.exports = (render, setCode) => (config = {}) => {
  if ((typeof setOrigin != 'function') || (typeof setWhitelist != 'function')) {
    throw new Error('Fatal: them Brackets are already mighty Square.');
  }

  const { inlineScript, inlineStyle, origin, whitelist } = config;

  if (typeof setCode == 'function') {
    setCode(inlineScript, inlineStyle);
  }

  setOrigin(origin || []);
  setWhitelist(whitelist || []);

  return render;
};
