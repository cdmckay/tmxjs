require.config({
    paths: {
        "jquery": "../lib/jquery"
    }
});

require(["jquery"], function($) {
    $.get("examples/desert_uncompressed.tmx", "xml")
        .done(function(xml) {
            var map = $(xml);
            alert(map.find("tileset").attr("source"));
        })
        .fail(function() {
            alert("Failed to open TMX file.");
        });
});