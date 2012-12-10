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
            TMXjs.Map.fromXML(xml, dir).done(function(map) {
                console.log(Util.format("Map has {0} tile set(s).", map.tileSets.length));
            });
        })
        .fail(function () {
            alert("Failed to open TMX file.");
        });
});