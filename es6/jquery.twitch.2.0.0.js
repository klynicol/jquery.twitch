/**
 * TwitchAThing v2.0.0-development
 * Copyright (c) 2018, Mark Wickline
 *
 * this source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 **/

/**
 * TODO LIST
 * 
 */
'use strict';
(function ($) {

    class Twitch{
        constructor(query, z, speed, distance){
            this.query = query; //jquery element
            this.able = true;
            this.child = null;
            this.position = query.position();
            this.positionMax = null;
            this.z = z;
            this.speed = speed;
            this.distance = distance;
            this.ID = (function () {
                return '_' + Math.random().toString(36).substr(2, 9);
            })();
        }
        get getID(){
            return this.ID;
        }
        engage(position){
            this.able = false;
            this.query.css({
                top: position.top,
                left: position.left
            });
            setTimeout(() => {
                this.able = true;
                this.positionMax = this.query.position();
            }, (this.speed * 1000));
            return position;
        }
        disengage(){
            this.query.css({
                top: this.position.top,
                left: this.position.left
            });
        }
    }

    $.fn.twitch = function (options) {
        if(typeof options === "object"){
            //settings
            let settings = $.extend({
                layers: 1,
                distance: 20,
                transition: 0.3
            }, options);
    
            //Errors and fail safes
            if (settings.layers < 0) throw new Error("Twittch layers cannot be lower than 0");
            else if (settings.layers > 4) throw new Error("Twitch layers cannot be larger than 4");
            else if (settings.layers > 1000) throw new Error("Twitch distance cannot be larger than 1000px");
            if (settings.distance < 0) settings.distance = 0;
            if (settings.transition < 0) settings.transition = 0;

            let twitchObjects = [];
            let transfer = null;
            let index = 0;

            return this.each(function () {
                //init each
                let current = new Twitch($(this), index, settings.transition, settings.distance);           //twitch object
                twitchObjects.push(current);
                console.log(twitchObjects);
                index ++;
                current.query.data("twitchID", current.getID);      //is a twitch element??
                current.query.css('transition', 'all ' + settings.transition + 's');


                let executeTwitch = function (element, quadrant, direction) {
                    return direction == "positive" ? 
                    (parseInt(element.position[quadrant]) + element.distance) : 
                    (parseInt(element.position[quadrant]) - element.distance);
                }
            
                let setTwitch = function (element, layersLeft, e) {
                    if(layersLeft > 0 && element){
                        element.query.hide(); //temp hide current
                        let underID = $(document.elementFromPoint(e.clientX, e.clientY)).data("twitchID") || null;
                        console.log(underID);
                        if (underID && layersLeft > 0) {
                            if(!element.child || element.child.ID !== underID){ //set new child
                                element.child = (function(){
                                    for(let x in twitchObjects){
                                        if(twitchObjects[x].ID === underID) return twitchObjects[x];
                                    }
                                })();
                                console.log(element.child);
                            }
                            setTwitch(element.child, (layersLeft - 1), e);
                        } else{
                            if(element.child){
                                element.child.disengage();
                                element.child = null;
                            }  
                        }
                        element.query.show();
                        //mouse position relative to the element
                        let offset = element.query.offset();
                        let pageX = e.pageX - offset.left;
                        let pageY = e.pageY - offset.top;
            
                        //twitch the element
                        let xDirection = pageX < (element.query.width() / 2) ? "positive" : "negative";
                        let yDirection = pageY < (element.query.height() / 2) ? "positive" : "negative";
                        element.engage({left: executeTwitch(element, "left", xDirection), top: executeTwitch(element, "top", yDirection)});
                    } else {
                        console.log("Out of layers, or no twitchObject found");
                    }
                }
            
                //////////////////////////////////////////
                current.query.mousemove(function (e) {
                    if(transfer && transfer.z > current.z){         //element is below current
                        current.child = transfer;
                    } else if(transfer && transfer.z < current.z){  //element is above current
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
                current.query.mouseleave((e) => {
                    let hoverID = $(document.elementFromPoint(e.clientX, e.clientY)).data("twitchID") || null;
                    if(hoverID){
                        transfer = current;
                    } else {
                        current.disengage();
                        transfer = null;
                    }
                });//END OF MOUSELEAVE
            });//END OF EACH!!
        } else{
            throw new Error("options needs to be an objet");
        }
    }
}(jQuery));