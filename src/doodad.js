define(["jquery", "./util/rectangle"], function ($, Rectangle) {
    var Doodad = function (bounds) {
        this.group = null;
        this.name = "Object";
        this.color = null;
        this.opacity = 1.0;
        this.visible = true;
        this.bounds = bounds || new Rectangle();
        this.properties = {};
    };

    Doodad.fromElement = function (element, options) {

    };

    return Doodad;
});