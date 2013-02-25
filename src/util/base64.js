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
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    return {
        /*
         * "decode" is Copyright (c) 2011, Daniel Guerrero
         * All rights reserved.
         *
         * Redistribution and use in source and binary forms, with or without
         * modification, are permitted provided that the following conditions are met:
         *     * Redistributions of source code must retain the above copyright
         *       notice, this list of conditions and the following disclaimer.
         *     * Redistributions in binary form must reproduce the above copyright
         *       notice, this list of conditions and the following disclaimer in the
         *       documentation and/or other materials provided with the distribution.
         *
         * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
         * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
         * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
         * DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
         * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
         * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
         * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
         * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
         * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
         * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
         */
        decode: function (str) {
            var last1 = alphabet.indexOf(str.charAt(str.length - 1));
            var last2 = alphabet.indexOf(str.charAt(str.length - 2));

            var length = (str.length / 4) * 3;
            if (last1 == 64) length--; //padding chars, so skip
            if (last2 == 64) length--; //padding chars, so skip

            var bytes = [];
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            var j = 0;

            str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            for (i = 0; i < length; i += 3) {
                //get the 3 octets in 4 ascii chars
                enc1 = alphabet.indexOf(str.charAt(j++));
                enc2 = alphabet.indexOf(str.charAt(j++));
                enc3 = alphabet.indexOf(str.charAt(j++));
                enc4 = alphabet.indexOf(str.charAt(j++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                bytes[i] = chr1;
                if (enc3 != 64) bytes[i + 1] = chr2;
                if (enc4 != 64) bytes[i + 2] = chr3;
            }

            return bytes;
        },
        encode: function (bytes) {
            var str = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            var j = 0;

            for (i = 0; i < bytes.length; i += 3) {
                chr1 = bytes[j++];
                chr2 = bytes[j++];
                chr3 = bytes[j++];

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = 64;
                    enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                str += alphabet.charAt(enc1);
                str += alphabet.charAt(enc2);
                str += alphabet.charAt(enc3);
                str += alphabet.charAt(enc4);
            }

            return str;
        }
    }
});
