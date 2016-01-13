# slide-it
A jquery widget plugin providing configurable slideshow functionality.

Depends on jquery (tested with 1.11.2) and the jquery-ui widget (tested with 1.11.4) component. jQuery.Widget can be downloaded on its own from the jquery ui download builder: http://jqueryui.com/download/. This plugin works exactly as all other jQuery widgets. It has options and methods.

To use, simply markup your slideshow with a container tag, and the slides as immediate children to that container. The names and classes below are examples only, and don't affect function. That said, you will need to be able to precisely select the container though - see START UP below.

```HTML
 <div id=slides-container>
   <div class=slide></div>
   <div class=slide></div>
   <div class=slide></div>
 </div> 
```

**SLIDES CONTAINER HEIGHT**

Note, the plugin will absolutely position the slides within the slide container. This in turn means that unless you have explicitly specified a height for the container, the container will have a height of 0 (assuming no other children within the container). If you wish the plugin to make an attempt at fixing the container height for you, then either run the setContainerHeight() method, or set the setContainerHeight option to true.
 
**START UP**

 Use jquery to select the container passing it to the slideit function, e.g. 
 
 ```JavaScript
 var slideShow = $('#slides-container').slideit();
```

It's best to set all options upfront, ie pass in an options object to slideit() on initialisation. Otherwise you may have to call a function or functions for the change to take effect, e.g.:

```JavaScript
slideShow.slideit('option','delay','8000');
slideShow.slideit('restart');
```

or

```JavaScript
slideShow.slideit('option','controlPanelBackground','#754');
slideShow.slideit('removeControlPanel'); //required if a control panel was already available
slideShow.slideit('addControlPanel');
```

**Options (with default):**
  * autoplay:true,
  * setContainerHeight: false,
  * controlPanel: false,
  * controlPanelBackground: '#777',
  * allowDelayChange : true, //displays timer change function if control panel shown
  * delay: 2000,
  * delayText:'Enter delay between cards in seconds',
  * ok:'Ok',
  * selector:'' // if there are only specific children to the container you wish to target, add the selector to this option
  * slideHide:'fadeOut',
  * slideShow:'fadeIn',
  * slideChangeTime:1000
  
**Methods:**
  * play(),
  * pause(),
  * playToggle(),
  * addControlPanel(),
  * removeControlPanel(),
  * restart(),
  * setContainerHeight()
  
There are no events associated with this plugin. However, events can be added if they are requested.
