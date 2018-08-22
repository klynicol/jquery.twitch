/**
 * TwitchAThing v1.0.0-development
 * Copyright (c) 2018-present, Mark Wickline
 *
 * this source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 **/
(function($) {
     $.fn.twitch = function(options) {

          let settings = $.extend({
               layers: 0,
               distance: 20,
               transition: 1
          }, options);

          //Errors and fail safes
          if(settings.layers < 0) throw new Error("tiwtch layers cannot be lower than 0");
          else if(settings.layers > 4) throw new Error("twitch layers cannot be larger than 4");
          if(settings.layers > 1000) throw new Error("twitch distance cannot be larger than 1000px");
          else if(settings.distance < 0) settings.distance = 0;
          if(settings.transition < 0) settings.distance = 0;

          
          //Creating a ticker for animations to run through before the next position is given
          // let start = Date.now();
          // let tick = 0;
          // let lastTick = 0;
          // setInterval(function(){
          //      let delta = Date.now() - start;
          //      tick = Math.floor(delta/(settings.transition * 1000));
          //      console.log("this thing is ticking");
          // }, (settings.transition * 1000));

          return this.each(function(){

               //data for each instance passed
               let each = $(this);
               let children = []; //store children so they can be killed later
               each.data("position", each.position());
               each.data("able", true);
               //each.data("children", []);
               //each.data("isTwitched", false);
               //let relative = each.position();
               
               each.mousemove(function(e) { //only applies to parent elements
                    let setTwitch = function(element, layersLeft, returnPostion){
                         //mouse position relative to the element
                         let offset = element.offset();
                         let pageX = e.pageX - offset.left;
                         let pageY = e.pageY - offset.top;

                         if (element.data("able")) { //if element is ready to be twitched again according to the transitions set
                              //set timer for able to execute again
                              setTimeout(function(){
                                   element.data("able", true);
                                   console.log("test1")
                              }, (settings.transition * 1000));

                              
                              

                              //temporarily hide element to check for element beneath and do a twitch on them
                              element.css('display', 'none');
                              let under = $(document.elementFromPoint(e.clientX, e.clientY)); //under = new element
                              if(under.is('.hover-twitch') && layersLeft > 0){
                                   console.log("check1");
                                   under.data("able", true);
                                   under.data("position", under.position());
                                   setTwitch(under, (layersLeft - 1), under.position());
                              }
                              element.css('display', 'inline-block');//unhide element again

                              //setting transition speed
                              element.css('transition', 'all ' + settings.transition + 's');

                              //twitch the element
                              let executeTwitch = function(quadrant, direction){
                                   let x = direction == "positive" ? (parseInt(returnPostion[quadrant]) + settings.distance) : (parseInt(returnPostion[quadrant]) - settings.distance);
                                   element.css('transition', 'all 1s');
                                   element.css(quadrant, x + 'px');
                              }
                              if (pageX < (element.width()/2)) executeTwitch("left", "positive"); else executeTwitch("left", "negative"); //twitch x
                              if (pageY > (element.height()/2)) executeTwitch("top", "negative"); else executeTwitch("top", "positive"); //twitch y

                              //mouse leave conditional kill parent and all children
                              element.mouseleave(function(){
                                   //console.log("mouse leave event fired");
                                   element.css({
                                        top : returnPostion.top,
                                        left : returnPostion.left
                                   });
                                   if(children){
                                        for (var i = 0; i < children.length; i++) {
                                             let child = children[i];
                                             child.css({
                                                  top : child.data("position").top,
                                                  left : child.data("position").left
                                             });
                                        }
                                   }
                              });
                              element.data("able", false);
                         }
                    }
                    //do the twitch on the original element
                    setTwitch(each, settings.layers, each.data("position"));
               });
          });
     }
}(jQuery));