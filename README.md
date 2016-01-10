# slide-it
A jquery widget plugin providing configurable slideshow functionality.

Depends on jquery and the jquery-ui widget component. jQuery.Widget can be downloaded on its own. It works exactly as all other widgets. It has options and methods.

Options (with default):
  * autoplay:true,
  * controlPanel: false,
  * controlPanelBackground: '#777',
  * allowDelayChange : true, //displays timer change function if control panel shown
  * delay: 2000,
  * delayText:'Enter delay between cards in seconds',
  * ok:'Ok',
  * selector:'',
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
