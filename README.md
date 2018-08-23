# Jquery plugin for responsive hover. The element is moved opposite of the mouse.

### Usage
___

When you hover over the element it responds by moving the opposite direction of your mouse.
```
$('#foo').twitch();
```
### Usage with options
```
$('#foo).twitch({
  layers: 1,       //Number, the number of layers will move if they are overlapping; default is 1
  distance: 20,    //Number, distance in pixels the element will travel while being hovered continuously; default is 20
  transition: 0.3  //Number, time in milliseconds for css transitions; default is 0.3
});
```
