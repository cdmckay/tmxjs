define(["jquery"], function ($) {
    var Rectangle = function (x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 0;
        this.h = h || 0;
    };

    Rectangle.prototype.contains = function (x, y) {
        var w = this.w + this.x;
        var h = this.h + this.y;
        return (w < this.x || w > x) && (h < this.y || h > y);
    };

    Rectangle.atOrigin = function (w, h) {
        return new Rectangle(0, 0, w, h);
    };

    return Rectangle;
});