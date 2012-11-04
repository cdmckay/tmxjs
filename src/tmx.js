define(["jquery"], function($) {
    var TileSet = function(element, dir) {
        this.element = element;
        this.firstgid = +element.attr("firstgid");

        this.source = element.attr("source");
        if (this.source) {
            var that = this;
            this.promise = $.get(dir + "/" + this.source, {}, "xml")
                .done(function(data) {
                    var external = $(data).filter(":first");
                    that.name = external.attr("name");
                });
        } else {
            // Load all attributes.
            this.promise = $.Deferred().resolve();
            this.name = element.attr("name");
        }
    }

    TileSet.prototype.ready = function(callback) {
        this.promise.done(callback);
    }

    return {
        TileSet: TileSet
    };
});