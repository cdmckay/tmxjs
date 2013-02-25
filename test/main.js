/*
 * Copyright 2013 Cameron McKay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require.config({
    paths: {
        jquery: "../lib/jquery",
        underscore: "./lib/underscore",
        nodeunit: "./lib/nodeunit",
        zlib: "../lib/zlib.min",
        tmxjs: "../src"
    },
    shim: {
        underscore: { exports: "_" },
        nodeunit: { exports: "nodeunit" },
        zlib: { exports: "Zlib" }
    }
});

require([
    "nodeunit",
    "map",
    "tile",
    "tile-layer",
    "tile-set",
    "util/base64",
    "util/rectangle"
], function (
    nodeunit,
    map,
    tile,
    tileLayer,
    tileSet,
    base64,
    rectangle
) {
    nodeunit.run({
        map: map,
        tile: tile,
        tileLayer: tileLayer,
        tileSet: tileSet,
        base64: base64,
        rectangle: rectangle
    });
});