'use strict';
const inlineScript = [];
const inlineStyle = [];

function setInlineScript(list) {
  inlineScript.push(...list);
  Object.freeze(inlineScript);
  delete api.setInlineScript;
}

function setInlineStyle(list) {
  inlineStyle.push(...list);
  Object.freeze(inlineStyle);
  delete api.setInlineStyle;
}

const matchInlineScript = value =>
  (inlineScript.indexOf(value) > -1);

const matchInlineStyle = value =>
  (inlineStyle.indexOf(value) > -1);

const api = {
  matchInlineScript,
  matchInlineStyle,
  setInlineScript,
  setInlineStyle,
};

module.exports = api;
