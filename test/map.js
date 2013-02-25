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