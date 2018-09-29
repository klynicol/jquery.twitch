/**
 * TwitchAThing v1.0.0-development
 * Copyright (c) 2018-present, Mark Wickline
 * this source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 **/
'use strict';
(function ($) {
    $.fn.twitch = function (options) {

        var settings = $.extend({
            layers: 1,
            distance: 20,
            transition: 0.3
        }, options);

        //Errors and fail safes
        if (settings.layers < 0) throw new Error("tiwtch layers cannot be lower than 0");else if (settings.layers > 4) throw new Error("twitch layers cannot be larger than 4");

        if (settings.layers > 1000) throw new Error("twitch distance cannot be larger than 1000px");else if (settings.distance < 0) settings.distance = 0;

        if (settings.transition < 0) settings.transition = 0;

        return this.each(function () {

            //data for each instance passed
            var each = $(this);
            each.data("twitchElement", function () {
                //holds Unique Id
                return '_' + Math.random().toString(36).substr(2, 9);
            }());
            each.data("child", null);
            each.data("position", each.position());
            each.data("transferPosition", null);
            each.data("able", true);

            //mouse is no longer over the element and disengage is in order
            function disengage(input, delay) {
                input.delay(delay).queue(function (next) {
                    $(this).css({
                        top: input.data("position").top,
                        left: input.data("position").left
                    });
                    next();
                });
                input.data("transferPostion", null);
            }

            each.mousemove(function (e) {
                //only applies to parent elements
                var setTwitch = function setTwitch(element, layersLeft, returnPostion) {
                    //mouse position relative to the element
                    var offset = element.offset();
                    var pageX = e.pageX - offset.left;
                    var pageY = e.pageY - offset.top;

                    if (element.data("transferPosition")) {
                        element.css({
                            top: element.data("transferPosition").top,
                            left: element.data("transferPosition").left
                        });
                    }

                    if (element.data("able")) {
                        //if element is ready to be twitched again according to the transitions set
                        //set timer for able to execute again
                        setTimeout(function () {
                            element.data("able", true);
                        }, settings.transition * 1000);

                        //setting transition speed
                        element.css('transition', 'all ' + settings.transition + 's');

                        //temporarily hide element to check for element beneath and do a twitch on them
                        element.hide();
                        var under = $(document.elementFromPoint(e.clientX, e.clientY));
                        if (under.data("twitchElement") && layersLeft > 0) {
                            //under.data("parent", element.data("twitchElement"));
                            var child = element.data("child");
                            if (!child) {
                                element.data("child", under);
                            } else if (child && under.data("twitchElement") !== child.data("twitchElement")) {
                                element.data("child", under);
                                console.log("new child selected");
                            } else {
                                //do nothing?
                            }
                            if (child && child.data("transferPosition")) {
                                child.css({
                                    top: child.data("transferPosition").top,
                                    left: child.data("transferPosition").left
                                });
                            }
                            if (!under.data("able")) under.data("able", true);
                            if (!under.data("position")) under.data("position", under.position());
                            setTwitch(under, layersLeft - 1, under.data("position"));
                        } else {
                            console.log("check2");
                            if (element.data("child")) {
                                disengage(element.data("child"), 0);
                                element.data("child", null);
                                console.log("check1: from - " + element.data("twitchElement"));
                            }
                        }
                        element.show();

                        //twitch the element
                        var executeTwitch = function executeTwitch(quadrant, direction) {
                            var x = direction == "positive" ? parseInt(returnPostion[quadrant]) + settings.distance : parseInt(returnPostion[quadrant]) - settings.distance;
                            element.css(quadrant, x + 'px').delay(settings.transition * 1000).data("transferPostion", element.position());
                        };
                        if (pageX < element.width() / 2) executeTwitch("left", "positive");else executeTwitch("left", "negative"); //twitch x
                        if (pageY > element.height() / 2) executeTwitch("top", "negative");else executeTwitch("top", "positive"); //twitch y
                        //disable moving the element until the timer has gone off
                        element.data("able", false);
                    }
                }; //END OF SET TWITCH FUNCTION
                //do the twitch on the original element
                setTwitch(each, settings.layers, each.data("position"));
            }); //END OF MOUSEMOVE EVENT
            //mouse leave conditional kill parent and all children
            each.mouseleave(function () {
                disengage(each, 2);
                console.log("Mouseleave");
            });
        }); //END OF EACH!!
    };
})(jQuery);