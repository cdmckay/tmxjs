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

define(['tmxjs/tile-set', 'tmxjs/tile'], function (TileSet, Tile) {
    var tests = {
        "test constructor": function (test) {
            var tileSet = new TileSet(42);
            test.equal(tileSet.firstGlobalId, 42);
            test.done();
        },

        "test addTile with no id": function (test) {
            var tileSet = new TileSet(42);
            var tile = new Tile();
            var id = tileSet.addTile(tile);
            test.equal(id, 0, "Should set the id when adding tile");
            test.done();
        },

        "test addTile with id": function (test) {
            var tileSet = new TileSet(42);
            var tile = new Tile();
            tile.id = 1;
            test.throws(function () {
                tileSet.addTile(tile)
            }, Error, "Should throw error when adding tile with id");
            test.done();
        },

        "test removeTileAt": function (test) {
            var tileSet = new TileSet(42);
            var tile = new Tile();
            tileSet.addTile(tile);
            test.notEqual(tileSet.getTileAt(0), null, "Should not be null after tile addition");
            test.equal(tileSet.tiles.length, 1, "Should have length 1 after tile addition");
            tileSet.removeTileAt(0);
            test.equal(tileSet.getTileAt(0), null, "Should be null after tile removal");
            test.equal(tileSet.tiles.length, 1, "Should still be length 1 after tile removal");
            test.done();
        }
    };

    return { tileSet: tests };
});