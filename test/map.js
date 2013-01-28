define(['tmxjs/map'], function (Map) {
    var tests = {
        "test constructor": function (test) {
            var map = new Map("isometric", 64, 32, 16, 32);
            test.equal(map.orientation, "isometric", "Should match the name argument");
            test.equal(map.bounds.w, 64, "Should match the width argument");
            test.equal(map.bounds.h, 32, "Should match the height argument");
            test.equal(map.tileInfo.w, 16, "Should match the tileWidth argument");
            test.equal(map.tileInfo.h, 32, "Should match the tileHeight argument");
            test.done();
        }
    };

    return { map: tests };
});