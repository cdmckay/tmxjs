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

define(function () {
    var Util = {};

    Util.format = function (format) {
        var ret = format;
        for (var index in arguments) {
            if (index == 0) continue;
            ret = ret.replace("{" + (index - 1) + "}", arguments[index]);
        }
        return ret;
    };

    Util.startsWith = function (str, prefix) {
        return str.indexOf(prefix) === 0;
    };

    Util.endsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    Util.size = function (iterable) {
        if (iterable == null) return 0;
        if (iterable.length === parseInt(iterable.length)) return iterable.length;
        if (Object.keys) return Object.keys(iterable).length;

        var size = 0;
        for (var key in iterable) {
            if (iterable.hasOwnProperty(key)) size++;
        }
        return size;
    };

    Util.urlFor = function (source, dir) {
        var isAbsolutePath = Util.startsWith(source, "http") || Util.startsWith(source, "/");
        return isAbsolutePath ? source : (dir || ".") + "/" + source;
    }

    return Util;
});