require.config({
    paths: {
        "jquery": "../lib/jquery"
    }
});

require(["jquery", "tmx", "util"], function ($, TMXjs, Util) {
    var url = "examples/desert_uncompressed.tmx";
    var dir = url.split("/").slice(0, -1) || ".";

    $.get("examples/desert_uncompressed.tmx", "xml")
        .done(function (xml) {
            TMXjs.Map.fromXML(xml, dir).done(function (map) {
                console.log(Util.format("Map has {0} tile set(s).", map.tileSets.length));
                console.log(map);
                $.each(map.tileSets, function () {
                    console.log(this);
                });
                var canvas = $("#map").css({
                    width: map.bounds.w * map.tileInfo.w,
                    height: map.bounds.h * map.tileInfo.h
                });
                $.each(map.layers, function (ln, layer) {
                    $.each(this.tiles, function (tn, tile) {
                        // TODO Generate CSS classes instead.
                        var i = tn % layer.bounds.w;
                        var j = Math.floor(tn / layer.bounds.w);
                        $("<div>")
                            .css({
                                position: "absolute",
                                left: i * tile.bounds.w,
                                top: j * tile.bounds.h,
                                width: tile.bounds.w,
                                height: tile.bounds.h,
                                background: Util.format("url({0}) repeat {1}px {2}px",
                                    tile.imageInfo.url, -tile.bounds.x, -tile.bounds.y)
                            })
                            .appendTo(canvas);
                    });
                });
            });
        })
        .fail(function () {
            alert("Failed to open TMX file.");
        });
});