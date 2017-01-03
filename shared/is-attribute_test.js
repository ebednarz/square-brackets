'use strict';
const { expect } = require('chai');
const isAttribute = require('./is-attribute');
let setOrigin;
let setWhitelist;

const whitelist = {
  EMAIL: 'mailto:localpart@example.com',
};

describe('The `isAttribute` module', function () {
  beforeEach(function () {
    setOrigin = require('./url').setOrigin;
    setWhitelist = require('./url').setWhitelist;
    setOrigin([
      'http://example.org',
    ]);
    setWhitelist(whitelist);
  });

  afterEach(function () {
    delete require.cache[require.resolve('./url')];
  });

  it('exports a user function', function () {
    expect(typeof isAttribute).to.equal('function');
  });

  describe('filters `href` and `source` URLs and', function () {
    it('accepts an absolute path without segments', function () {
      expect(isAttribute('href', '/')).to.be.true;
      expect(isAttribute('src', '/')).to.be.true;
    });

    it('accepts an absolute path with segments', function () {
      expect(isAttribute('href', '/foo')).to.be.true;
      expect(isAttribute('src', '/foo')).to.be.true;
    });

    it('rejects an URL that starts with two slashes', function () {
      expect(isAttribute('href', '//')).to.be.false;
      expect(isAttribute('src', '//')).to.be.false;
    });

    it('accepts HTTP(S) URLs with a registered origin', function () {
      expect(isAttribute('href', 'http://example.org/foo')).to.be.true;
      expect(isAttribute('src', 'http://example.org/foo')).to.be.true;
    });

    it('rejects HTTP(S) URLs without a registered origin', function () {
      expect(isAttribute('href', 'http://example.org:8080/foo')).to.be.false;
      expect(isAttribute('src', 'http://example.org:8080/foo')).to.be.false;
    });

    it('accepts URLs with other protocols than HTTP(s) that are whitelisted', function () {
      expect(isAttribute('href', whitelist.EMAIL)).to.be.true;
      expect(isAttribute('src', whitelist.EMAIL)).to.be.true;
    });

    it('rejects URLs with other protocols than HTTP(s) that are not whitelisted', function () {
      expect(isAttribute('href', 'mailto:unknown@example.com')).to.be.false;
      expect(isAttribute('src', 'mailto:unknown@example.com')).to.be.false;
    });

  });

});
