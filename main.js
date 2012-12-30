require.config({
    paths: {
        gunzip: "lib/gunzip.min",
        inflate: "lib/inflate.min",
        jquery: "lib/jquery",
        tmxjs: "src",
        underscore: "lib/underscore"
    },
    shim: {
        gunzip: { exports: "Zlib.Gunzip" },
        inflate: { exports: "Zlib.Inflate" },
        underscore: { exports: "_" }
    }
});

require([
    "gunzip",
    "inflate",
    "jquery",
    "tmxjs/map",
    "tmxjs/util/string-util"
], function (
    Gunzip,
    Inflate,
    $,
    Map,
    StringUtil
) {
    var url = "examples/desert_base64_gzip.tmx";
    var options = {
        dir: url.split("/").slice(0, -1) || ".",
        compression: {
            gzip: {
                decompress: function (bytes) { return new Gunzip(bytes).decompress(); }
            },
            zlib: {
                decompress: function (bytes) { return new Inflate(bytes).decompress(); }
            }
        }
    };

    $.get(url, {}, null, "xml")
        .done(function (xml) {
            Map.fromXML(xml, options).done(function (map) {
                console.log(map);
                $.each(map.tileSets, function () {
                    console.log(this);
                });
                // TODO Move to separate file.
                var canvas = $("#map").css({
                    width: map.bounds.w * map.tileInfo.w,
                    height: map.bounds.h * map.tileInfo.h
                });
                var ruleSets = {};
                $.each(map.layers, function (ln, layer) {
                    $.each(layer.tiles, function (tn, tile) {
                        if (tile == null) {
                            return true;
                        }

                        var i = tn % layer.bounds.w;
                        var j = Math.floor(tn / layer.bounds.w);
                        var tileSet = map.findTileSet(tile.getGlobalId());

                        var format, ruleSet;
                        if (!ruleSets["tile-set-"] + tileSet.firstGlobalId) {
                            format = [
                                "background-image: url({0});"
                            ].join("/");
                            ruleSet = StringUtil.format(format, tile.imageInfo.url);
                            ruleSets["tile-set-" + tileSet.firstGlobalId] = ruleSet;
                        }
                        if (!ruleSets["tile-" + tile.getGlobalId()]) {
                            format = [
                                "width: {0}px;",
                                "height: {1}px;",
                                "background-repeat: no-repeat;",
                                "background-position: {2}px {3}px;"
                            ].join(" ");
                            ruleSet = StringUtil.format(format,
                                tile.bounds.w,
                                tile.bounds.h,
                                -tile.bounds.x,
                                -tile.bounds.y
                            );
                            ruleSets["tile-" + tile.getGlobalId()] = ruleSet;
                        }

                        var classes = StringUtil.format('tile-set tile-set-{0} tile tile-{1}',
                            tileSet.firstGlobalId,
                            tile.getGlobalId()
                        );
                        $("<div>", {
                            'id': 'tile-' + tn,
                            'class': classes,
                            'style': StringUtil.format("left: {0}px; top: {1}px;",
                                i * tile.bounds.w,
                                j * tile.bounds.h
                            )
                        }).appendTo(canvas);

                        return true;
                    });
                });
                // Create the CSS classes.
                var styleSheet = [ ".tile { position: absolute; }" ];
                $.each(ruleSets, function (key, value) {
                    styleSheet.push(StringUtil.format(".{0} { {1} }", key, value));
                });
                var style = $("<style>", { type: 'text/css' })
                    .html(styleSheet.join("\n"))
                    .appendTo($("head"));
            });
        })
        .fail(function () {
            alert("Failed to open TMX file.");
        });
});