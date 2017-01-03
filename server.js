'use strict';
const booleanAttributes = require('./server/boolean-attributes');
const escape = require('./server/escape');
const {
  matchInlineScript,
  matchInlineStyle,
  setInlineScript,
  setInlineStyle
} = require('./server/inline-code');
const optionalEndTags = require('./server/optional-end-tags');
const voidElements = require('./server/void-elements');
const isAttribute = require('./shared/is-attribute');
const factoryFactory = require('./shared/factory-factory');

const getKey = key => key.toLowerCase();

const getAttributeSpecification = input =>
  Object
    .keys(input)
    .reduce(function (spec, key) {
      if (!isAttribute(key, input[key])) {
        return spec;
      }

      const normalizedKey = getKey(key);

      if (booleanAttributes.indexOf(normalizedKey) === -1) {
        const value = escape(input[key]);

        if (/^[a-z\d_-]+$/.test(value)) {
          return `${spec} ${normalizedKey}=${value}`;
        }

        return `${spec} ${normalizedKey}="${value}"`;
      }

      return `${spec} ${normalizedKey}`;
    }, '');

function getContent(children, element, attributes) {
  if (typeof children == 'string') {
    switch (element) {
      case 'script':
        return matchInlineScript(children) ? children : '/* script removed */';
      case 'style':
        return matchInlineStyle(children) ? children : '/* style removed */';
      default:
        return escape(children.trim());
    }
  }

  return renderSubTree(children);
}

function expand(leaf) {
  const gi = leaf[0].toLowerCase();
  const isContentFirst = (leaf[1] && (typeof leaf[1] === 'string') || Array.isArray(leaf[1]));
  let attributes = '';

  if (leaf[1] && !isContentFirst) {
    attributes = getAttributeSpecification(leaf[1]);
  }

  const stag = `<${gi}${attributes}>`;

  if (voidElements.indexOf(gi) !== -1) {
    return stag;
  } else {
    let content = '';
    let etag = '';

    if (isContentFirst) {
      content = getContent(leaf[1], gi);
    } else if (leaf[2]) {
      content = getContent(leaf[2], gi, leaf[1]);
    }

    if (optionalEndTags.indexOf(gi) === -1) {
      etag = `</${gi}>`;
    }

    return `${stag}${content}${etag}`;
  }
}

const renderSubTree = tree =>
  tree.reduce((domString, leaf) =>
    `${domString}${(typeof leaf === 'string') ?
      escape(leaf.trim()) :
      expand(leaf)}`,
    '');

function setCode(inlineScript, inlineStyle) {
  if ((typeof setInlineScript != 'function') || (typeof setInlineStyle != 'function')) {
    throw new Error('Fatal: them Brackets are already mighty Square.');
  }

  setInlineScript(inlineScript || []);
  setInlineStyle(inlineStyle || []);
}

module.exports = factoryFactory(tree => `<!DOCTYPE html>${renderSubTree(tree)}`, setCode);
