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

define(["jquery", "./util/rectangle"], function ($, Rectangle) {
    var Doodad = function (bounds) {
        this.group = null;
        this.name = "Object";
        this.color = null;
        this.opacity = 1.0;
        this.visible = true;
        this.bounds = bounds || new Rectangle();
        this.properties = {};
    };

    Doodad.fromElement = function (element, options) {

    };

    return Doodad;
});