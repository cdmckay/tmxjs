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

define(function () {
    var Cell = function (tile, flipped) {
        this.tile = tile;
        this.flipped = flipped || {
            horizontally: false,
            vertically: false,
            antidiagonally: false
        };
    };

    var FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
    var FLIPPED_VERTICALLY_FLAG = 0x40000000;
    var FLIPPED_ANTIDIAGONALLY_FLAG = 0x20000000;

    Cell.prototype.getFlippedGlobalId = function () {
        // TODO Finish this.
    };

    Cell.getFlippedFrom = function (flippedGlobalId) {
        return {
            horizontally: (flippedGlobalId & FLIPPED_HORIZONTALLY_FLAG) !== 0,
            vertically: (flippedGlobalId & FLIPPED_VERTICALLY_FLAG) !== 0,
            antidiagonally: (flippedGlobalId & FLIPPED_ANTIDIAGONALLY_FLAG) !== 0
        };
    };

    Cell.getGlobalIdFrom = function (flippedGlobalId) {
        return flippedGlobalId & ~(
            FLIPPED_HORIZONTALLY_FLAG |
            FLIPPED_VERTICALLY_FLAG |
            FLIPPED_ANTIDIAGONALLY_FLAG
        );
    };

    return Cell;
});