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
    var url = "examples/desert_rotated.tmx";
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
                    $.each(layer.cells, function (tn, cell) {
                        if (cell == null) {
                            return true;
                        }

                        var i = tn % layer.bounds.w;
                        var j = Math.floor(tn / layer.bounds.w);
                        var tileSet = map.findTileSet(cell.tile.getGlobalId());

                        var flippedClass = StringUtil.format("flipped-{0}-{1}-{2}",
                            +cell.flipped.horizontally,
                            +cell.flipped.vertically,
                            +cell.flipped.antidiagonally);
                        var classes = [
                            "tile-set",
                            "tile-set-" + tileSet.firstGlobalId,
                            "tile",
                            "tile-" + cell.tile.getGlobalId(),
                            flippedClass
                        ];

                        var format, ruleSet;
                        if (!ruleSets["tile-set-"] + tileSet.firstGlobalId) {
                            format = [
                                "background-image: url({0});"
                            ].join("/");
                            ruleSet = StringUtil.format(format, cell.tile.imageInfo.url);
                            ruleSets["tile-set-" + tileSet.firstGlobalId] = ruleSet;
                        }
                        if (!ruleSets["tile-" + cell.tile.getGlobalId()]) {
                            format = [
                                "width: {0}px;",
                                "height: {1}px;",
                                "background-repeat: no-repeat;",
                                "background-position: {2}px {3}px;"
                            ].join(" ");
                            ruleSet = StringUtil.format(format,
                                cell.tile.bounds.w,
                                cell.tile.bounds.h,
                                -cell.tile.bounds.x,
                                -cell.tile.bounds.y
                            );
                            ruleSets["tile-" + cell.tile.getGlobalId()] = ruleSet;
                        }
                        if (!ruleSets[flippedClass]) {
                            var m = [1, 0, 0, 1];
                            if (cell.flipped.antidiagonally) {
                                m[0] = 0;
                                m[1] = 1;
                                m[2] = 1;
                                m[3] = 0;
                            }
                            if (cell.flipped.horizontally) {
                                m[0] = -m[0];
                                m[2] = -m[2];
                            }
                            if (cell.flipped.vertically) {
                                m[1] = -m[1];
                                m[3] = -m[3];
                            }
                            var matrix = StringUtil.format(
                                "m({0}, {1}, {2}, {3}, 0, 0)",
                                m[0],
                                m[1],
                                m[2],
                                m[3]
                            );
                            var dxMatrix =  StringUtil.format(
                                "progid:DXImageTransform.Microsoft.Matrix(M11={0},M12={1},M21={2},M22={3},sizingMethod='auto expand')",
                                m[0],
                                m[1],
                                m[2],
                                m[3]
                            );
                            ruleSet = [
                                "-moz-transform: " + matrix + ";",
                                "-o-transform: " + matrix + ";",
                                "-webkit-transform: " + matrix + ";",
                                "transform: " + matrix + ";",
                                '-ms-filter: "' + dxMatrix + '";',
                                "filter: " + dxMatrix + ";"
                            ].join(" ");
                            ruleSets[flippedClass] = ruleSet;
                        }

                        $("<div>", {
                            'id': 'tile-' + tn,
                            'class': classes.join(" "),
                            'style': StringUtil.format("left: {0}px; top: {1}px;",
                                i * cell.tile.bounds.w,
                                j * cell.tile.bounds.h
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