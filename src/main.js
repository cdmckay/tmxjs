require.config({
    paths: {
        "jquery": "../lib/jquery"
    }
});

require(["jquery", "tmx"], function($, TMXjs) {
    var url = "examples/desert_uncompressed.tmx";
    var dir = url.split("/").slice(0, -1) || ".";

    $.get("examples/desert_uncompressed.tmx", "xml")
        .done(function(data) {
            var tileSet = new TMXjs.TileSet($(data).find("tileset:eq(1)"), dir);
            tileSet.ready(function() {
                alert("TileSet is: " + tileSet.name);
            });
        })
        .fail(function() {
            alert("Failed to open TMX file.");
        });
});