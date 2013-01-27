define(["jquery", "./util/rectangle"], function ($, Rectangle) {
    var Layer = function (name, bounds) {
        this.name = name;
        this.visible = true;
        this.map = null;
        this.opacity = 1.0;
        this.bounds = bounds || new Rectangle();
        this.properties = {};
    };

    Layer.prototype.rotate = function (angle) {
        throw new Error("Not implemented");
    };

    Layer.prototype.mirror = function (direction) {
        throw new Error("Not implemented");
    };

    Layer.prototype.clone = function () {
        throw new Error("Not implemented");
    };

    return Layer;
});