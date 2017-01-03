'use strict';
const factoryFactory = require('./shared/factory-factory');
const isAttribute = require('./shared/is-attribute');

const elementRegexp = /^(?!(?:script|style)$)(?:[a-z][a-z\d]*)$/i;

const isElement = type => elementRegexp.test(type);

function appendTextOrFragment(element, descriptor) {
  if (typeof descriptor == 'string') {
    element.appendChild(document.createTextNode(descriptor));
    return true;
  } else if (Array.isArray(descriptor)) {
    element.appendChild(createFragment(descriptor));
    return true;
  }

  return false;
}

function setAttributes(element, attributes) {
  Object
    .keys(attributes)
    .forEach(function (key) {
      if (isAttribute(key, attributes[key])) {
        element.setAttribute(key.toLowerCase(), attributes[key]);
      }
    });
}

function createElementNode(descriptor) {
  const [p1, p2, p3] = descriptor;
  const element = document.createElement(p1.toUpperCase());

  if (!appendTextOrFragment(element, p2)) {
    if (p2) {
      setAttributes(element, p2);
      appendTextOrFragment(element, p3);
    }
  }

  return element;
}

function append(node, fragment) {
  if (typeof node == 'string') {
    fragment.appendChild(document.createTextNode(node));
  } else if (isElement(node[0])) {
    fragment.appendChild(createElementNode(node));
  }

  return fragment;
}

const createFragment = descriptor =>
  descriptor
    .reduce((fragment, node) =>
      append(node, fragment), document.createDocumentFragment());

module.exports = factoryFactory(createFragment);
