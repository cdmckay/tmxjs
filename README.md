TMXjs
=====

TMXjs is a JavaScript, [jQuery](http://jquery.com/) and [RequireJS](http://requirejs.org)-based library for reading,
manipulating, and writing [TMX](https://github.com/bjorn/tiled/wiki/TMX-Map-Format) files.

For a demo, please visit [the TMXjs Editor demo site at cdmckay.org](http://cdmckay.org/tmxjs-editor/).

## Getting Started

TMXjs isn't available as a single JavaScript file yet, so you'll need to download the entire `src` folder and place
it in a folder, typically named `tmxjs`. Here's an example project layout that is used by
[TMXjs Editor](https://github.com/cdmckay/tmxjs-editor/):

- js/
    - lib/
        - tmxjs/
            - ...
        - jquery.js
        - require.js
        - zlib.min.js
    - main.js
- index.html

TMXjs depends on jQuery, RequireJS, Zlib, so they all need to be shimmed in your RequireJS config for TMXjs to work.
Here's an example `index.html` file:

```html
<!doctype html>
<html>
<head>
    <title>...</title>
    <script type="text/javascript" src="js/lib/require.js" data-main="js/main"></script>
</head>
<body>
    ...
</body>
</html>
```

If you're not familiar with RequireJS, it may seem weird to only be including one JavaScript file, even though we have
dependencies. These are taken care of in the `main.js` file:

```javascript
require.config({
    paths: {
        jquery: "lib/jquery",
        zlib: "lib/zlib.min",
        tmxjs: "src"
    },
    shim: {
        zlib: { exports: "Zlib" }
    }
});

require([
    "jquery",
    "tmxjs/map",
], function (
    $,
    Map
) {
    // ...
});
```

## Importing TMX Files

TODO Finish this