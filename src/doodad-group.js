define(["jquery", "./layer", "./util/rectangle"], function ($, Layer, Rectangle) {
    var DoodadGroup = function(map, bounds) {
        Layer.call(this, map, bounds);
        this.doodads = [];
    };
    DoodadGroup.prototype = new Layer;
    DoodadGroup.prototype.constructor = DoodadGroup;

    DoodadGroup.prototype.addDoodad = function (doodad) {
        doodad.group = this;
        this.doodads.push(doodad);
    };

    DoodadGroup.prototype.removeDoodad = function (doodad) {
        for (var n = 0; n < this.doodads.length; n++) {
            if (this.doodads[n] === doodad) {
                this.doodads.splice(n, 1);
                doodad.group = null;
                break;
            }
        } // end for
    };

    DoodadGroup.prototype.getDoodadAt = function (x, y) {
        this.getDoodadNear(x, y, 0);
    };

    DoodadGroup.prototype.getDoodadNear = function (x, y, tolerance) {

    };

    DoodadGroup.fromElement = function (element, options) {

    };

    return DoodadGroup;
});