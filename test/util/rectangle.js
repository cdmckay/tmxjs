/*
 * Copyright 2013 Cameron McKay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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