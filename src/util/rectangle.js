define(function () {
    var Rectangle = function (x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 0;
        this.h = h || 0;
    };

    Rectangle.prototype.contains = function (x, y) {
        var w = this.w + this.x;
        var h = this.h + this.y;
        if (x < this.x || y < this.y) {
            return false;
        }
        return (w < this.x || w > x) && (h < this.y || h > y);
    };

    Rectangle.prototype.translate = function(dx, dy) {
        this.x += dx;
        this.y += dy;
    };

    Rectangle.prototype.clone = function () {
        return new Rectangle(this.x, this.y, this.w, this.h);
    };

    Rectangle.atOrigin = function (w, h) {
        return new Rectangle(0, 0, w, h);
    };

    return Rectangle;
});