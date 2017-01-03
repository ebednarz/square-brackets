'use strict';
module.exports = input => input
  .replace(/&/gm, '&amp;')
  .replace(/</gm, '&lt;')
  .replace(/>/gm, '&gt;')
  .replace(/"/gm, '&quot;')
  .replace(/'/gm, '&#x27;')
  .replace(/\//gm, '&#x2F;');
