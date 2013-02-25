TMXjs
=====

TMXjs is a JavaScript, [jQuery](http://jquery.com/) and [RequireJS](http://requirejs.org)-based library for reading,
manipulating, and writing [TMX](https://github.com/bjorn/tiled/wiki/TMX-Map-Format) files.

For a demo, please visit [the TMXjs Editor demo site at cdmckay.org](http://cdmckay.org/tmxjs-editor/).

## Getting Started

TMXjs isn't available as a single JavaScript file yet, so you'll need to download the entire `src` folder and place
it in a folder, typically named `tmxjs`. Here's an example project layout that is used by
[TMXjs Editor](https://github.com/cdmckay/tmxjs-editor/):

```
js/
  lib/
    tmxjs/
      ...
    jquery.js
    require.js
    zlib.min.js
index.html
main.js

```

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
        "jquery": "lib/jquery",
        "zlib": "lib/zlib.min",
        "tmxjs": "lib/tmxjs",
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
    // Code that uses TMXjs goes here.
});
```

## Importing TMX Files

In order to use a TMX file with TMXjs you'll first need to download it using an XHR request. Since TMXjs requires
jQuery, that library is typically used for this task:

```javascript
require([
    "jquery",
    "tmxjs/map",
], function (
    $,
    Map
) {
    var url = "path/to/map.tmx";
    var options = {
        // Extracts the URL path. This is required to be passed to Map.fromXML(...) or
        // it will assume all resources like TSX files and images are in the current folder.
        dir: url.split("/").slice(0, -1) || "."
    };

    $.get(url, {}, null, "xml").done(function (xml) {
        // fromXML calls are asynchronous because TSX resources may need to be loaded by TMXjs.
        Map.fromXML(xml, options).done(function (map) {
            // Code that uses the Map object goes here.
        });
    });
});
```

## Exporting TMX Files

The `Map#toXML` method is used to export a Map object to XML. Continuing from the import example:

```javascript
require([
    "jquery",
    "tmxjs/map",
], function (
    $,
    Map
) {
    var url = "path/to/map.tmx";
    var options = {
        // Extracts the URL path. This is required to be passed to Map.fromXML(...) or
        // it will assume all resources like TSX files and images are in the current folder.
        dir: url.split("/").slice(0, -1) || "."
    };

    $.get(url, {}, null, "xml").done(function (xml) {
        // fromXML calls are asynchronous because TSX resources may need to be loaded by TMXjs.
        Map.fromXML(xml, options).done(function (map) {
            map.name = "Export Example!";

            // The Map#toXML method returns an XMLDocument object.
            var doc = map.toXML();
            var xmlString = doc.context.xml || new XMLSerializer().serializeToString(doc.context);
            console.log(xmlString);
        });
    });
});

...and that's it!

## TMXjs Implementation Status

TODO Finish this
