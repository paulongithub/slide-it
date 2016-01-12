# slide-it
A jquery widget plugin providing configurable slideshow functionality.

Depends on jquery and the jquery-ui widget component. jQuery.Widget can be downloaded on its own. It works exactly as all other widgets. It has options and methods.

To use default settings, simply markup your slideshow with a container tag, and the slides as immediate children to that container. e.g. 

```HTML
 <div id=slide-parent>
   <div class=child-slide></div>
   <div class=child-slide></div>
   <div class=child-slide></div>
 </div> 
```
 
 Then use jquery to select the container passing it to the slideit function, e.g. 
 
 ```JavaScript
 var slideShow = $('#slide-parent').slideit();
```

If you wish to change an options after starting the slidshow, just use the restart method after changing the option, eg

```JavaScript
slideShow.slideit('option','controlPanel',true);
slideShow.slideit('restart');
```

Options (with default):
  * autoplay:true,
  * controlPanel: false,
  * controlPanelBackground: '#777',
  * allowDelayChange : true, //displays timer change function if control panel shown
  * delay: 2000,
  * delayText:'Enter delay between cards in seconds',
  * ok:'Ok',
  * selector:'' // if there are only specific children to the container you wish to target, and the selector to this option,
  * slideHide:'fadeOut',
  * slideShow:'fadeIn',
  * slideChangeTime:1000
  
Methods:
  * play(),
  * pause(),
  * playToggle(),
  * addControlPanel(),
  * removeControlPanel(),
  * restart()
  
There are no events associated with this plugin. However, events can be added if requested.
