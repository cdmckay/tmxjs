define(["jquery", "./util/rectangle", "./util/util"], function ($, Rectangle, Util) {
    var Tile = function () {
        this.id = null;
        this.tileSet = null;
        this.bounds = new Rectangle();
        this.imageInfo = { source: null, w: 0, h: 0 };
        this.properties = {};
    };

    Tile.prototype.getGlobalId = function () {
        return this.tileSet.firstGlobalId + this.id;
    };

    Tile.prototype.toXML = function (xml, options) {
        var tileEl = $("<tile>", xml).attr("id", this.id);
        if (Util.size(this.properties)) {
            var propertiesEl = $("<properties>", xml);
            $.each(this.properties, function (k, v) {
                var propertyEl = $("<property>", xml).attr({ name: k, value: v });
                propertiesEl.append(propertyEl);
            });
            tileEl.append(propertiesEl);
        }
        return tileEl;
    };

    Tile.fromElement = function (element, options) {
        var tileElement = $(element);
        var tile = new Tile();
        tile.id = tileElement.attr("id") || null;
        tileElement.find("properties:first property").each(function () {
            tile.properties[$(this).attr("name")] = $(this).attr("value");
        });
        return tile;
    };

    return Tile;
});