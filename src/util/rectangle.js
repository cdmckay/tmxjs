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
    var Rectangle = function (x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 0;
        this.h = h || 0;
    };

    Rectangle.prototype.contains = function (x, y) {
        var w = this.w + this.x;
        var h = this.h + this.y;
        if (x < this.x || y < this.y) {
            return false;
        }
        return (w < this.x || w > x) && (h < this.y || h > y);
    };

    Rectangle.prototype.translate = function(dx, dy) {
        this.x += dx;
        this.y += dy;
    };

    Rectangle.prototype.clone = function () {
        return new Rectangle(this.x, this.y, this.w, this.h);
    };

    Rectangle.atOrigin = function (w, h) {
        return new Rectangle(0, 0, w, h);
    };

    return Rectangle;
});