define(["tmxjs/util/rectangle"], function(Rectangle) {
    var tests = {
        "test constructor": function (test) {
            var x = 1, y = 2, w = 4, h = 8;
            var rect = new Rectangle(x, y, w, h);
            test.equal(rect.x, x, "Should match x argument");
            test.equal(rect.y, y, "Should match y argument");
            test.equal(rect.w, w, "Should match w argument");
            test.equal(rect.h, h, "Should match h argument");
            test.done();
        },

        "test atOrigin": function (test) {
            var w = 1, h = 2;
            var rect = Rectangle.atOrigin(w, h);
            test.equal(rect.x, 0, "Should be 0");
            test.equal(rect.y, 0, "Should be 0");
            test.done();
        },

        "test contains when inside": function (test) {
            var rect = Rectangle.atOrigin(4, 4);
            test.ok(rect.contains(0, 0), "Should contain point 0,0");
            test.ok(rect.contains(1, 1), "Should contain point 1,1");
            test.done();
        },

        "test contains when outside": function (test) {
            var rect = new Rectangle(1, 1, 4, 4);
            test.ok(!rect.contains(0, 0), "Should not contain point 0,0");
            test.ok(!rect.contains(6, 6), "Should not contain point 6,6");
            test.done();
        },

        "test contains when on edge": function (test) {
            var rect = new Rectangle(1, 1, 4, 4);
            test.ok(rect.contains(1, 1), "Should contain point 1,1");
            test.ok(!rect.contains(5, 5), "Should not contain point 5,5");
            test.done();
        }
    };

    return { rectangle: tests };
});