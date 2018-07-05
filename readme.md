Task runner tools
=================

[![build status](https://img.shields.io/travis/runner/tools.svg?style=flat-square)](https://travis-ci.org/runner/tools)
[![npm version](https://img.shields.io/npm/v/@runner/tools.svg?style=flat-square)](https://www.npmjs.com/package/@runner/tools)
[![dependencies status](https://img.shields.io/david/runner/tools.svg?style=flat-square)](https://david-dm.org/runner/tools)
[![devDependencies status](https://img.shields.io/david/dev/runner/tools.svg?style=flat-square)](https://david-dm.org/runner/tools?type=dev)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/runner)
[![RunKit](https://img.shields.io/badge/RunKit-try-yellow.svg?style=flat-square)](https://npm.runkit.com/@runner/tools)


## Installation ##

```bash
npm install @runner/tools
```


## Usage ##

Add to the scope:

```js
var tools = require('@runner/tools');
```

Remove some generated files:

```js
tools.unlink(
    ['build/develop/main.css', 'build/develop/main.js'],
    log,
    function ( error ) {
        console.log(error);    
    }
);
```

Write generated files content:

```js
tools.write(
    [{name: 'build/develop/main.js', data: someContent}],
    log,
    function ( error ) {
        console.log(error);    
    }
);
```

Create new directories and any necessary subdirectories:

```js
tools.mkdir(
    ['build/develop', 'build/release'],
    log,
    function ( error ) {
        console.log(error);    
    }
);
```

Copy a directory content to another place:

```js
tools.copy(
    {
        source: 'src/img',
        target: 'build/develop/img'
    },
    log,
    function ( error ) {
        console.log(error);
    }
);
```

## Contribution ##

If you have any problems or suggestions please open an [issue](https://github.com/runner/tools/issues)
according to the contribution [rules](.github/contributing.md).


## License ##

`@runner/tools` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
