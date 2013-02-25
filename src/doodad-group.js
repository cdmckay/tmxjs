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

define(["jquery", "./layer", "./util/rectangle"], function ($, Layer, Rectangle) {
    var DoodadGroup = function(name, bounds) {
        Layer.call(this, name, bounds);
        this.doodads = [];
    };
    DoodadGroup.prototype = new Layer();
    DoodadGroup.prototype.constructor = DoodadGroup;

    DoodadGroup.prototype.addDoodad = function (doodad) {
        doodad.group = this;
        this.doodads.push(doodad);
    };

    DoodadGroup.prototype.removeDoodad = function (doodad) {
        for (var n = 0; n < this.doodads.length; n++) {
            if (this.doodads[n] === doodad) {
                this.doodads.splice(n, 1);
                doodad.group = null;
                break;
            }
        } // end for
    };

    DoodadGroup.prototype.getDoodadAt = function (x, y) {
        this.getDoodadNear(x, y, 0);
    };

    DoodadGroup.prototype.getDoodadNear = function (x, y, tolerance) {

    };

    DoodadGroup.prototype.clone = function () {
        var layer = new DoodadGroup();

        // Layer
        layer.name = this.name;
        layer.visible = this.visible;
        layer.map = this.map;
        layer.opacity = this.opacity;
        layer.bounds = this.bounds.clone();
        layer.properties = $.extend({}, this.properties);

        // Doodad Group
        layer.doodads = this.doodads.slice();

        return layer;
    };

    DoodadGroup.prototype.toXML = function (xml, options) {

    };

    DoodadGroup.fromElement = function (element, options) {

    };

    return DoodadGroup;
});