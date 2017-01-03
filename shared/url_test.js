'use strict';
const { expect } = require('chai');
let url;

describe('The `url` module', function () {
  beforeEach(function () {
    url = require('./url');
  });

  afterEach(function () {
    delete require.cache[require.resolve('./url')];
  });

  it('exports a `matchOrigin` method', function () {
    expect(typeof url.matchOrigin).to.equal('function');
  });

  it('exports a `matchWhitelist` method', function () {
    expect(typeof url.matchWhitelist).to.equal('function');
  });


  it('exports a `setOrigin` method', function () {
    expect(typeof url.setOrigin).to.equal('function');
  });

  it('exports a `setWhitelist` method', function () {
    expect(typeof url.setWhitelist).to.equal('function');
  });

  it('throws a type error if setOrigin is called more than once', function () {
    let typeError;

    url.setOrigin([
      'http://example.org'
    ]);

    try {
      url.setOrigin([
        'https://www.owasp.org',
      ]);
    } catch (error) {
      typeError = error;
    }

    expect(typeError instanceof TypeError).to.be.true;
  });

  it('throws a type error if setWhitelist is called more than once', function () {
    let typeError;

    url.setWhitelist({
      EMAIL: 'mailto:localpart@example.com',
    });

    try {
      url.setWhitelist({
        FOO: 'bar'
      });
    } catch (error) {
      typeError = error;
    }

    expect(typeError instanceof TypeError).to.be.true;
  });

});
