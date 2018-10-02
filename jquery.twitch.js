/**
 * TwitchAThing v2.0.0-development
 * Copyright (c) 2018, Mark Wickline
 *
 * this source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * Compiled from es6
 **/

/**
 * TODO LIST
 * 
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var Twitch = function () {
        function Twitch(query, z, speed, distance) {
            _classCallCheck(this, Twitch);

            this.query = query; //jquery element
            this.able = true;
            this.child = null;
            this.position = query.position();
            this.positionMax = null;
            this.z = z;
            this.speed = speed;
            this.distance = distance;
            this.ID = function () {
                return '_' + Math.random().toString(36).substr(2, 9);
            }();
        }

        _createClass(Twitch, [{
            key: 'engage',
            value: function engage(position) {
                var _this = this;

                this.able = false;
                this.query.css({
                    top: position.top,
                    left: position.left
                });
                setTimeout(function () {
                    _this.able = true;
                    _this.positionMax = _this.query.position();
                }, this.speed * 1000);
                return position;
            }
        }, {
            key: 'disengage',
            value: function disengage() {
                this.query.css({
                    top: this.position.top,
                    left: this.position.left
                });
            }
        }, {
            key: 'getID',
            get: function get() {
                return this.ID;
            }
        }]);

        return Twitch;
    }();

    $.fn.twitch = function (options) {
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === "object") {
            //settings
            var settings = $.extend({
                layers: 1,
                distance: 20,
                transition: 0.3
            }, options);

            //Errors and fail safes
            if (settings.layers < 0) throw new Error("Twittch layers cannot be lower than 0");else if (settings.layers > 4) throw new Error("Twitch layers cannot be larger than 4");else if (settings.layers > 1000) throw new Error("Twitch distance cannot be larger than 1000px");
            if (settings.distance < 0) settings.distance = 0;
            if (settings.transition < 0) settings.transition = 0;

            var twitchObjects = [];
            var transfer = null;
            var index = 0;

            return this.each(function () {
                //init each
                var current = new Twitch($(this), index, settings.transition, settings.distance); //twitch object
                twitchObjects.push(current);
                console.log(twitchObjects);
                index++;
                current.query.data("twitchID", current.getID); //is a twitch element??
                current.query.css('transition', 'all ' + settings.transition + 's');

                var executeTwitch = function executeTwitch(element, quadrant, direction) {
                    return direction == "positive" ? parseInt(element.position[quadrant]) + element.distance : parseInt(element.position[quadrant]) - element.distance;
                };

                var setTwitch = function setTwitch(element, layersLeft, e) {
                    if (layersLeft > 0 && element) {
                        element.query.hide(); //temp hide current
                        var underID = $(document.elementFromPoint(e.clientX, e.clientY)).data("twitchID") || null;
                        console.log(underID);
                        if (underID && layersLeft > 0) {
                            if (!element.child || element.child.ID !== underID) {
                                //set new child
                                element.child = function () {
                                    for (var x in twitchObjects) {
                                        if (twitchObjects[x].ID === underID) return twitchObjects[x];
                                    }
                                }();
                                console.log(element.child);
                            }
                            setTwitch(element.child, layersLeft - 1, e);
                        } else {
                            if (element.child) {
                                element.child.disengage();
                                element.child = null;
                            }
                        }
                        element.query.show();
                        //mouse position relative to the element
                        var offset = element.query.offset();
                        var pageX = e.pageX - offset.left;
                        var pageY = e.pageY - offset.top;

                        //twitch the element
                        var xDirection = pageX < element.query.width() / 2 ? "positive" : "negative";
                        var yDirection = pageY < element.query.height() / 2 ? "positive" : "negative";
                        element.engage({ left: executeTwitch(element, "left", xDirection), top: executeTwitch(element, "top", yDirection) });
                    } else {
                        console.log("Out of layers, or no twitchObject found");
                    }
                };

                //////////////////////////////////////////
                current.query.mousemove(function (e) {
                    if (transfer && transfer.z > current.z) {
                        //element is below current
                        current.child = transfer;
                    } else if (transfer && transfer.z < current.z) {//element is above current
                        //TODO
                    } else {
                            //TODO
                        }
                    if (current.able) {
                        //console.log("Base element is able");
                        setTwitch(current, settings.layers, e);
                    }
                }); //END OF MOUSEMOVE EVENT
                /////////////////////////////////////////////
                current.query.mouseleave(function (e) {
                    var hoverID = $(document.elementFromPoint(e.clientX, e.clientY)).data("twitchID") || null;
                    if (hoverID) {
                        transfer = current;
                    } else {
                        current.disengage();
                        transfer = null;
                    }
                }); //END OF MOUSELEAVE
            }); //END OF EACH!!
        } else {
            throw new Error("options needs to be an objet");
        }
    };
})(jQuery);