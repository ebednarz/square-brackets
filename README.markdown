# `:-[ Square Brackets ]-:`

> Compact, lightweight and serializable HTML description syntax 
  for server- and client-side ECMAScript.

## Installation

### yarn

    yarn add square-brackets

### npm

    npm install square-brackets

## Supported elements and attributes

The nasty Three Witches of HTML are

- scripts (obviously)
- style sheets
- URLs

**Element** and **attribute** *names* are only restricted by blacklisting:

1. the `script` and `style` **elements** are blacklisted client-side.
    * if you need any lazy loading, do that by other means
2. the `style` **attribute** and all event attributes (`on*`) are blacklisted.

**Element** *content* and **attribute** *values* are restricted by whitelisting:

1. server-side *inline* `script` and `style` element content must be specified as a list of strings
2. URLs in `href` and `src` attributes that do not

    1. consist of a single forward slash
    2. start with a forward slash followed by any **other** character

    must be specified as a list of

    1. allowed origins (protocol, hostname and port)
    2. complete URLs (e.g. for `data`, `mailto` and so on)

## Usage

File `./origin.js`:

    module.exports = [
      'https://github.com',
      'http://localhost:8080',
    ];

NB: URLs are matched against literal origin strings, 
user information or explicit default ports are not supported.

File `./whitelist.js`:

    module.exports = {
      AVATAR: 'data:image/png;base64,...',
      EMAIL: 'localpart@example.org',
      TELEPHONE: '+123456789',
    };

### Client

    const origin = require('./origin');
    const whitelist = require('./whitelist');
    const render = require('square-brackets/client')({ origin, whitelist });
    const descriptor = [
      'Hello, ',
      ['strong', 'world'],
      '!',
    ];
    const fragment = render(descriptor);
    const div = document.createElement('div');
    div.appendChild(fragment);

    console.log(div.innerHTML);
    // "Hello, <strong>world</strong>!"

### Server

    const origin = require('./origin');
    const whitelist = require('./whitelist');
    const render = require('square-brackets/server')({ origin, whitelist });
    const descriptor = [
      ['html', [
        ['head', [
          ['title', 'Hello, world!'],
        ]],
        ['body', [
          ['h1', 'Hello, world!'],
        ],
      ],
    ];

    console.log(render(descriptor));
    // <!DOCTYPE html><head><title>Hello, world!</title><body><h1>Hello, world!</h1>

NB: the HTML DOCTYPE is always automagically prepended to the result string because
constructing a complete response body is the only use case for server-side rendering;
constructing and sending partial HTML responses is invariably married to alarming naivety,
like setting `innerHTML` 

NB: end tags and quotes around attribute values are omitted in simple, safe cases 

## Utilities

File `article.markdown`:

    # Hello, World.
    
    This is *markdown*.

Server-side processing:

    const { fromMarkdown, prettyPrint } = require('square-brackets/library');
    const { readFileSync } = require('fs');
    const input = readFileSync('./article.markdown', 'utf8');
    const parsed = fromMarkdown(input);

    console.log(JSON.stringify(parsed, null, 2);
    // [
    //   [ 
    //     "h1", 
    //     "Hello, world!"
    //   ],
    //   [
    //     "p", 
    //     [
    //       "This is ",
    //       [
    //         "em", 
    //         "markdown"
    //       ],
    //       "."
    //     ]
    //   ]
    // ]   

    const prettified = prettyPrint(parsed);
    
    console.log(prettified);
    // [
    //   ["h1", "Hello, world!"],
    //   ["p", [
    //     "This is ",
    //     ["em", "markdown"],
    //     "."
    //   ]]
    // ]   

## License

MIT
