'use strict';
const { Parser } = require('commonmark');
const CommonMarkDescriptor = require('./common-mark-descriptor');

function getProperties(elementDescriptor) {
  let attributes;
  let children;

  if (Array.isArray(elementDescriptor[2])) {
    attributes = elementDescriptor[1];
    children = elementDescriptor[2];
  } else if (Array.isArray(elementDescriptor[1])) {
    children = elementDescriptor[1];
  }

  return {
    attributes,
    children,
  };
}

function mergeTightListParagraphFragmentsWithSiblings(fragment) {
  let length = fragment.length;

  while (length--) {
    const descriptor = fragment[length];

    if (Array.isArray(descriptor)) {
      const { children } = getProperties(descriptor);

      if (children) {
        mergeTightListParagraphFragmentsWithSiblings(children);

        if (descriptor[0] === null) {
          fragment.splice(length, 1, ...children);
        }
      }
    }
  }
}

function reduceFragmentToText(fragment) {
  let length = fragment.length;

  while (length--) {
    const descriptor = fragment[length];

    if (Array.isArray(descriptor)) {
      const { attributes, children } = getProperties(descriptor);

      if (children) {
        if (children.every(child => (typeof child == 'string'))) {
          const childNode = children.join('');
          fragment[length] = attributes ?
            [descriptor[0], attributes, childNode] :
            [descriptor[0], childNode];
        } else {
          reduceFragmentToText(children);
        }
      }
    }
  }
}

function processFragment(fragment) {
  mergeTightListParagraphFragmentsWithSiblings(fragment);
  reduceFragmentToText(fragment);
  return fragment;
}

module.exports = function (input) {
  const stack = [];

  const reader = new Parser();
  const ast = reader.parse(input);
  const walker = ast.walker();

  const descriptor = new CommonMarkDescriptor(stack);

  let event;
  let lastManStanding;

  while ((event = walker.next())) {
    const { entering, node } = event;

    if (entering) {
      if (node.isContainer) {
        stack.push([]);

        if (node.type === 'document') {
          continue;
        }
      }

      descriptor[node.type](node);
    } else {
      lastManStanding = stack.pop();
    }
  }

  return processFragment(lastManStanding);
};
