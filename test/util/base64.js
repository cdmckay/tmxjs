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

define(["underscore", "tmxjs/util/base64"], function(_, Base64) {
    var tests = {
        "test encode": function (test) {
            var bytes = [ 77, 97, 110 ];
            var str = Base64.encode(bytes);
            test.equals(str, "TWFu", "Should be TWFu");
            test.done();
        },

        "test decode": function (test) {
            var str = "TWFu";
            var bytes = Base64.decode(str);
            test.equals(bytes[0], 77);
            test.equals(bytes[1], 97);
            test.equals(bytes[2], 110);
            test.done();
        },

        "test encode/decode": function (test) {
            var message = "This is a secret message!";
            var bytes = _.map(_.toArray(message), function(ch) { return ch.charCodeAt(0); });
            var encodedMessage = Base64.encode(bytes);
            var decodedBytes = Base64.decode(encodedMessage);
            var decodedMessage = _.map(decodedBytes, function (b) { return String.fromCharCode(b); }).join("");
            test.equals(decodedMessage, message);
            test.done();
        }
    };

    return { base64: tests };
});