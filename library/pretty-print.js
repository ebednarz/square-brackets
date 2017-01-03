'use strict';
const INDENT = '  ';
const getIndent = level => (new Array(level + 1)).join(INDENT);
const escape = value => JSON.stringify(value);

function getAttributesString(attributes, indent) {
  const keys = Object.keys(attributes);
  const last = (keys.length - 1);

  return keys
    .reduce((string, key, index) => [
      string,
      getIndent(indent + 1),
      escape(key), ': ', escape(attributes[key]),
      (index < last) ?
        ',\n' :
        `\n${getIndent(indent)}}`
    ].join(''), '{\n');
}

function getElementString(descriptor, indent) {
  const segments = [escape(descriptor[0])];
  const nextIndent = (indent + 1);

  if (descriptor.length > 1) {
    if (typeof descriptor[1] == 'string') {
      segments.push(escape(descriptor[1]));
    } else if (Array.isArray(descriptor[1])) {
      segments.push(getFragmentString(descriptor[1], nextIndent));
    } else {
      segments.push(getAttributesString(descriptor[1], nextIndent));

      if (typeof descriptor[2] == 'string') {
        segments.push(escape(descriptor[2]));
      } else if (Array.isArray(descriptor[2])) {
        segments.push(getFragmentString(descriptor[2], nextIndent));
      }
    }
  }

  return `[${segments.join(', ')}]`;
}

const getFragmentString = (input, indent = 0) =>
  input
    .reduce((string, node, index) => [
      string,
      getIndent(indent + 1),
      (typeof node == 'string') ?
        escape(node) :
        getElementString(node, indent),
      (index < (input.length - 1)) ?
        ',\n' :
        `\n${getIndent(indent)}]`,
    ].join(''), '[\n');

module.exports = getFragmentString;
