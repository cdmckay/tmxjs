define(["jquery", "util"], function($, Util) {
    var TileSet = function(firstGlobalId) {
        this.firstGlobalId = firstGlobalId;
    }

    TileSet.fromXML = function(element, dir) {
        var firstGlobalId = Util.toNumber(element.attr("firstgid"));
        var tileSet = new TileSet(firstGlobalId);

        var extract = function(e) {
            tileSet.name = e.attr("name");
            tileSet.tileWidth = Util.toNumber(e.attr("tilewidth"));
            tileSet.tileHeight = Util.toNumber(e.attr("tileheight"));
            tileSet.spacing = Util.toNumber(e.attr("spacing"));
            tileSet.margin = Util.toNumber(e.attr("margin"));
        };

        tileSet.source = element.attr("source");
        var promise = $.Deferred();
        if (tileSet.source) {
            $.get(dir + "/" + this.source, {}, "xml")
                .done(function(data) {
                    var external = $(data).filter(":first");
                    extract(external);
                    promise.resolve(tileSet);
                });
        } else {
            // Load all attributes.
            extract(element);
            promise.resolve(tileSet);
        }

        return promise;
    };

    return {
        TileSet: TileSet
    };
});