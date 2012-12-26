define(["jquery", "./util/rectangle"], function ($, Rectangle) {
    var Doodad = function (bounds) {
        this.doodadGroup = null;
        this.name = "Object";
        this.color = null;
        this.opacity = 1.0;
        this.visible = true;
        this.bounds = bounds || new Rectangle();
        this.properties = {};
    };

    return Doodad;
});