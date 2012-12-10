define(["jquery", "layer"], function ($, Layer) {
    var TileLayer = function(map, width, height) {
        Layer.call(this, map, width, height);

        this.grid = [];
        this.tileProperties = {};
    };
    TileLayer.prototype = Layer;

    TileLayer.prototype.rotate = function (angle) {
        var transformedGrid = [];
        var transform = { x: 0, y: 0 };
        switch (angle) {
            case 90:
                transform.x = this.bounds.h - 1;
                break;
            case 180:
                transform.x = this.bounds.w - 1;
                transform.y = this.bounds.h - 1;
                break;
            case 270:
                transform.y = this.bounds.w - 1;
                break;
            default:
                throw new Error("Unsupported rotation angle: " + angle);
        }
        // TODO Fill in the rest.
    };

    TileLayer.prototype.mirror = function(direction) {
        switch (direction) {
            case "horizontal":
                break;
            case "vertical":
                break;
            default:
                throw new Error("Unsupported mirror direction: " + direction);
        }
        // TODO Fill in the rest.
    };

    return TileLayer;
});