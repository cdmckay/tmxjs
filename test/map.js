define(['tmxjs/map'], function (Map) {
    var tests = {
        "test constructor": function (test) {
            var map = new Map("orthogonal", 64, 32);
            test.equal(map.bounds.w, 64, "Should match the width argument");
            test.equal(map.bounds.h, 32, "Should match the height argument");
            test.done();
        }
    };

    return { map: tests };
});