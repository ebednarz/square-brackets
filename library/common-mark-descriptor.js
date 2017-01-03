'use strict';

module.exports = class {

  constructor(stack) {
    this.stack = stack;
  }

  push({ firstChild, isContainer, parent, type }, descriptor) {
    const offset = (isContainer ? 2 : 1);
    this.stack[(this.stack.length - offset)].push(descriptor);
  }

  getChildren() {
    return this.stack[(this.stack.length - 1)];
  }

  block_quote(node) {
    this.push(node, ['blockquote', this.getChildren()]);
  }

  code(node) {
    this.push(node, ['code', node.literal]);
  }

  code_block(node) {
    this.push(node, ['pre', [
      ['code', node.literal],
    ]]);
  }

  emph(node) {
    this.push(node, ['em', this.getChildren()]);
  }

  heading(node) {
    this.push(node, [`h${node.level}`, this.getChildren()]);
  }

  html_block(node) {
    this.push(node, node.literal);
  }

  html_inline(node) {
    this.push(node, node.literal);
  }

  image(node) {
    const attributes = {
      src: node.destination,
    };

    if (node.firstChild && node.firstChild.literal) {
      attributes.alt = node.firstChild.literal;
    }

    if (node.title) {
      attributes.title = node.title;
    }

    this.push(node, ['img', attributes]);
  }

  item(node) {
    this.push(node, ['li', this.getChildren()]);
  }

  linebreak(node) {
    this.push(node, ['br']);
  }

  link(node) {
    const attributes = {
      href: node.destination,
    };

    if (node.title) {
      attributes.title = node.title;
    }

    this.push(node, ['a', attributes, this.getChildren()]);
  }

  list(node) {
    const genericIdentifier = (node.listType === 'bullet') ? 'ul' : 'ol';
    const attributes = (genericIdentifier === 'ol') &&
      (node.listStart > 1) && {
        start: node.listStart,
      };

    if (attributes) {
      this.push(node, [genericIdentifier, attributes, this.getChildren()]);
    } else {
      this.push(node, [genericIdentifier, this.getChildren()]);
    }
  }

  paragraph(node) {
    const grandParent = node.parent.parent;

    if (grandParent && grandParent.listTight) {
      this.push(node, [null, this.getChildren()]);
    } else {
      this.push(node, ['p', this.getChildren()]);
    }
  }

  softbreak(node) {
    this.push(node, ' ');
  }

  strong(node) {
    this.push(node, ['strong', this.getChildren()]);
  }

  text(node) {
    this.push(node, node.literal);
  }

  thematic_break(node) {
    this.push(node, ['hr']);
  }

};
