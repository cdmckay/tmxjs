TMXjs
=====

TMXjs is a JavaScript, [jQuery](http://jquery.com/) and [RequireJS](http://requirejs.org)-based library for reading,
manipulating, and writing [TMX](https://github.com/bjorn/tiled/wiki/TMX-Map-Format) files.

To see an example of TMXjs code being used in a practical application, see the
[Tilecraft project](https://github.com/cdmckay/tilecraft/).

To see TMXjs in action, please visit [the Tilecraft demo site at cdmckay.org](http://cdmckay.org/tilecraft/).

## Getting Started

TMXjs isn't available as a single JavaScript file yet, so you'll need to download the entire `src` folder and place
it in a folder, typically named `tmxjs`. Here's an example project layout that is used by
[Tilecraft](https://github.com/cdmckay/tilecraft/):

```
js/
  lib/
    tmxjs/
      ...
    jquery.js
    require.js
    zlib.min.js
  main.js
index.html
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
```

...and that's it!

## TMXjs Implementation Status

The TMXjs implementation of the [TMX file format](https://github.com/bjorn/tiled/wiki/TMX-Map-Format) is incomplete.

The biggest omissions are lack of support for `<objectgroup>` and `<imagelayer>` elements.


