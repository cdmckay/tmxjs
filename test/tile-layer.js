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

define([
    'tmxjs/cell',
    'tmxjs/map',
    'tmxjs/tile',
    'tmxjs/tile-layer',
    'tmxjs/util/rectangle'
], function (
    Cell,
    Map,
    Tile,
    TileLayer,
    Rectangle
) {
    var tests = {
        "test constructor with name argument": function (test) {
            var name = "test";
            var tileLayer = new TileLayer(name);
            test.equal(tileLayer.name, name, "Should match name");
            test.done();
        },

        "test constructor with name and bounds arguments": function (test) {
            var name = "test";
            var bounds = Rectangle.atOrigin(4, 8);
            var tileLayer = new TileLayer(name, bounds);
            test.equal(tileLayer.name, name, "Should match name");
            test.equal(tileLayer.bounds.w, bounds.w, "Should match passed bounds width");
            test.equal(tileLayer.bounds.h, bounds.h, "Should match passed bounds height");
            test.done();
        },

        "test setCellAt": function (test) {
            var cell = new Cell();
            var tileLayer = new TileLayer(null, Rectangle.atOrigin(32, 32));
            tileLayer.setCellAt(1, 2, cell);
            test.equal(tileLayer.getCellAt(1, 2), cell, "The tile at 1,2 should be set");
            test.done();
        },

        "test setCellAt when out of bounds": function (test) {
            var cell = new Cell();
            var tileLayer = new TileLayer(null, Rectangle.atOrigin(32, 32));
            tileLayer.setCellAt(40, 40, cell);
            test.equal(tileLayer.getCellAt(40, 40), null, "The tile at 40,40 should not be set");
            test.done();
        },

        "test rotate by 90 degrees": function (test) {
            var cell1 = new Cell();
            var cell2 = new Cell();
            var tileLayer = new TileLayer(null, Rectangle.atOrigin(16, 32));
            tileLayer.setCellAt(1, 1, cell1);
            tileLayer.setCellAt(4, 4, cell2);
            var oldBounds = tileLayer.bounds;
            tileLayer.rotate(90);
            test.equal(tileLayer.bounds.w, oldBounds.h, "Should be the old height");
            test.equal(tileLayer.bounds.h, oldBounds.w, "Should be the old width");
            test.equal(tileLayer.getCellAt(tileLayer.bounds.w - 2, 1), cell1, "The tile at w-2,1 should be tile1");
            test.equal(tileLayer.getCellAt(tileLayer.bounds.w - 5, 4), cell2, "The tile at w-5,4 should be tile2");
            test.done();
        }
    };

    return { tileLayer: tests };
});