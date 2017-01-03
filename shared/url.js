'use strict';
const origin = [];
const whitelist = [];

function setOrigin(list) {
  origin.push(...list.map(item => new RegExp(`^${item}(\\/|$)`)));
  Object.freeze(origin);
  delete api.setOrigin;
}

function setWhitelist(map) {
  whitelist.push(...Object.keys(map).map(key => map[key]));
  Object.freeze(whitelist);
  delete api.setWhitelist;
}

const matchOrigin = value =>
  origin.some(regexp => regexp.test(value));

const matchWhitelist = value =>
  (whitelist.indexOf(value) > -1);

const api = {
  matchOrigin,
  matchWhitelist,
  setOrigin,
  setWhitelist,
};

module.exports = api;
