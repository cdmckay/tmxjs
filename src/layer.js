define(["jquery", "./util/rectangle"], function ($, Rectangle) {
    var Layer = function (map, bounds) {
        this.name = null;
        this.visible = true;
        this.map = map;
        this.opacity = 1.0;
        this.bounds = bounds || Rectangle.atOrigin(
            (map && map.bounds.w) || 0,
            (map && map.bounds.h) || 0
        );
        this.properties = {};
    };

    Layer.prototype.rotate = function (angle) {
        throw new Error("Not implemented");
    };

    Layer.prototype.mirror = function (direction) {
        throw new Error("Not implemented");
    };

    return Layer;
});