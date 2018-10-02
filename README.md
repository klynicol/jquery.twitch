# Jquery plugin for responsive hovering.

### Usage
___

When you hover over the element it responds by moving the opposite direction of your mouse. This plugin was built with the intention of dealing with overlapping images. You can specify the number of layers you want to affect with the hover, up to 4.

This plugin is a work in progress.
```
$('#foo').twitch();
```
### Usage with options
```
$('#foo).twitch({
  layers: 1,       //Number: the number of layers affected; default is 1
  distance: 20,    //Number: distance in pixels the element will travel; default is 20
  transition: 0.3  //Number: time in milliseconds for css transitions; default is 0.3
});
```

[View Demo!](http://markwickline.com/twitch.html)
