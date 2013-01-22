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