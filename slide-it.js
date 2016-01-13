    //new jquery widget plugin for bespoke slider
    (function($){
    
        $.widget( "psd.slideit", {
            
            options: {
                autoplay:true,
                setContainerHeight: false,
                controlPanel: false,
                controlPanelBackground: '#777',
                allowDelayChange : true,
                delay: 2000,
                delayText:'Enter delay between cards in seconds',
                ok:'Ok',
                selector:'',
                slideHide:'fadeOut',
                slideShow:'fadeIn',
                slideChangeTime:1000
            },
            
            _create : function(){
                
                this.element.addClass(this._widgetClass);
                this._getSlides();
                
                if (this.options.setContainerHeight)
                    this.setContainerHeight();
                
                this._createControlPanelTemplates();
                
                if (this.options.controlPanel)
                    this.addControlPanel();
                
                if (this.options.autoplay) 
                    this.play();
                
            },
            
            _destroy : function(){
                
                this.element.removeClass(this._widgetClass);
                this._slides.removeClass(this._slideClass);
                this._slides.each(function(){
                    $(this).removeAttr('style');
                });
                this.pause();
            },
          
            //private globals
            _timer : 0,
            _slides : [],
            _slideCount : 0,
            _currentSlideIndex : 0,
            _playing: false,
            _slideClass : 'slideit-slides',
            _controlPanel : [],
            _delayControl : [],
            
            _createControlPanelTemplates : function() {
                
                //initialise control panels object
                this._controlPanelSettings = {};
                var cps = this._controlPanelSettings;
                cps.dataCtrl = 'data-slideit-ctrl';
                cps.controlPanel = {};
                cps.delayControl = {};
                
                var cp = cps.controlPanel;
                var dc = cps.delayControl;
                
                //control panel settings
                cp.attachTo = this.element;
                
                //control wrappers
                cp.wrappers = {};
                cp.wrappers.defaultWrapper = '<div/>';
                
                cp.parentClass = 'slideit-control-panel';

                //control panel controls                
                cp.dataCtrlNames = {};
                var cpDcn = cp.dataCtrlNames;
                cpDcn.delay = {};
                cpDcn.back = {};
                cpDcn.playPause = {};
                cpDcn.forward = {};
                
                //ctrl name
                cpDcn.delay.name = 'delaydialogopen';
                cpDcn.back.name = 'back';
                cpDcn.playPause.name = 'play-pause';
                cpDcn.forward.name = 'fwd';
                
                //ctrl ordinal
                cpDcn.delay.ordinal = 1; 
                cpDcn.back.ordinal = 2;
                cpDcn.playPause.ordinal = 3;
                cpDcn.forward.ordinal = 4;
                
                //ctrl handler required
                cpDcn.delay.handler = true;
                cpDcn.back.handler = true;
                cpDcn.playPause.handler = true;
                cpDcn.forward.handler = true;
                
                ////////////////////////////
                
                //delay control settings
                dc.attachTo = 'body';
                
                //control wrappers
                dc.wrappers = {};
                dc.wrappers.defaultWrapper = '<div/>';
                dc.wrappers.delayText = '<p/>';
                dc.wrappers.input = '<input type="text" />';
                dc.wrappers.ok = '<button/>';
                
                dc.parentClass = 'slideit-delay-control';

                //control panel controls                
                dc.dataCtrlNames = {};
                var dcDcn = dc.dataCtrlNames;
                dcDcn.close = {};
                dcDcn.input = {};
                dcDcn.ok = {};
                dcDcn.delayText = {};
                
                //ctrl name
                dcDcn.close.name = 'closedialog';
                dcDcn.input.name = 'delay-time';
                dcDcn.ok.name = 'ok';
                dcDcn.delayText.name = this.options.delayText;
                
                //ctrl ordinal
                dcDcn.close.ordinal = 1;
                dcDcn.input.ordinal = 3;
                dcDcn.ok.ordinal = 4;
                dcDcn.delayText.ordinal = 2;
                
                //ctrl handler required
                dcDcn.close.handler = true;
                dcDcn.input.handler = false;
                dcDcn.ok.handler = true;
                dcDcn.delayText.handler = false;
                
            },
            
            _handleControlRequest : function(ctrl){
                
                switch(ctrl) {
                    
                    case 'fwd':
                        this.pause();
                        var next = this._getNextSlideIndex();
                        this._changeSlide(next);
                        
                        break;
                    
                    case 'back':
                        this.pause();
                        var next = this._getPreviousSlideIndex();
                        this._changeSlide(next);
                        break;
                    
                    case 'play-pause':
                        this.playToggle();
                        break;
                        
                        break;
                    
                    case 'delaydialogopen':
                        
                        this._delayControl.show();
                        break;
                    
                    case 'closedialog':
                        this._delayControl.hide();
                        break;
                    
                    case 'ok':
                        var attrVal =  '[' + this._controlPanelSettings.dataCtrl + '='+ this._controlPanelSettings.delayControl.dataCtrlNames.input.name + ']';
                        var delay = parseFloat(this._delayControl.children(attrVal).val()) * 1000;
                        
                        if (isNaN(delay) || ! isFinite(delay))
                            return;
                        
                        this._setOption('delay',delay);
                        this.restart();
                        this._delayControl.hide();
                        break;
                }
            },
            
            _getNextSlideIndex : function(){
                return this._currentSlideIndex === (this._slideCount - 1) ? 0 : this._currentSlideIndex + 1;
            },
            
            _getPreviousSlideIndex : function(){
                return this._currentSlideIndex === 0 ? (this._slideCount - 1) : this._currentSlideIndex - 1;
            },
            
            _changeSlide : function(moveTo){
                
                this._slides.eq(this._currentSlideIndex)[this.options.slideHide](this.options.slideChangeTime);
                this._slides.eq(moveTo)[this.options.slideShow](this.options.slideChangeTime);
                this._currentSlideIndex = moveTo;
                
            },
            
            _getSlides : function(){
                
                if (this._slides.length)
                    this._slides.removeClass(this._slideClass);
                    
                this._slides = this.element.children(this.options.selector).addClass(this._slideClass);
                this._slideCount = this._slides.length;
                this._currentSlideIndex = 0;
                
                this._slides.hide();
                this._slides.eq(this._currentSlideIndex).show();
            },
            
            _widgetClass : 'slideit',
            
            play : function(immediate){
                
                typeof immediate === 'undefined' ? false : true;
                
                if (this._playing) 
                    return 'already playing';
                
                this._playing = true;
                
                if(this._controlPanel.length) {
                    
                    var attrVal = '[' + this._controlPanelSettings.dataCtrl + '=' + this._controlPanelSettings.controlPanel.dataCtrlNames.playPause.name + ']';
                    this._controlPanel.children(attrVal).removeClass('play').addClass('pause');
                }
                
                
                if (immediate) {
                    var next = this._getNextSlideIndex();
                    this._changeSlide(next);
                }
                
                var app = this;
                this._timer = setInterval(function(){
                    
                    var next = app._getNextSlideIndex();
                    
                    if (app._playing) {
                        app._changeSlide(next);
                    }
                },this.options.delay);
            },
            
            
            pause : function(){
                
                if (! this._playing)           
                    return 'already paused';
                
                clearInterval(this._timer);
                this._playing = false;
                this._timer = 0;
                
                if(this._controlPanel.length) {
                    
                    var attrVal = '[' + this._controlPanelSettings.dataCtrl + '=' + this._controlPanelSettings.controlPanel.dataCtrlNames.playPause.name + ']';
                    this._controlPanel.children(attrVal).removeClass('pause').addClass('play');
                }
                

            },
            
            playToggle : function(){
                this._playing ? this.pause() : this.play(true);
            },
            
            removeControlPanel : function () {
                if (this._controlPanel.length) {
                    this._controlPanel.remove();
                    this._controlPanel = [];
                }
                
                if (this._delayControl.length) {
                    this._delayControl.remove();
                    this._delayControl = [];
                }
            },
            
            restart : function(){
                this.pause();
                this.play();
            },
            
            addControlPanel : function(){
                this._addControlPanel();
            },
            
            _addControlPanel : function(type){
                
                //default control panel is controlPanel
                type = typeof type === 'undefined' ? 'controlPanel' : type;
                
                if (this['_' + type].length) {
                    console.log('control panel exists');
                    return;
                }
    
                //copy the settings and set up the overall wrapper
                var settings = this._controlPanelSettings[type];
                var controlPanelTag = typeof settings.wrappers[type] !== 'undefined' ? settings.wrappers[type] : settings.wrappers.defaultWrapper;
                this['_' + type] = $(controlPanelTag).addClass(settings.parentClass);
                
                //get all the controls which need to be added to the control panel and an attribute to use as to store the ctrl identifier
                var controls = settings.dataCtrlNames;
                var dataCtrlAttr = this._controlPanelSettings.dataCtrl;
                var app = this;
                
                //set up each control, its handler and attach it to its control panel
                for(var ctrl in controls) {
                    if (! controls.hasOwnProperty(ctrl)) 
                        continue;
                    
                    if (type === 'controlPanel' && ctrl === 'delay' && ! this.options.allowDelayChange)
                        continue;
                    
                    var control = typeof settings.wrappers[ctrl] !== 'undefined' ? settings.wrappers[ctrl] : settings.wrappers.defaultWrapper;
                    var attrs = {};
                    attrs[dataCtrlAttr] = controls[ctrl].name;
                    attrs['data-ordinal'] = controls[ctrl].ordinal;
                    control = $(control).attr(attrs);
                    
                    if (controls[ctrl].name === 'play-pause')
                        this._playing ? control.addClass('pause') : control.addClass('play');
                    
                    //if there is an option for this ctrl inject it as text to the control
                    if (typeof this.options[ctrl] === 'string')
                        control.text(this.options[ctrl]);
                        
                    var children = this['_' + type].children();
                    
                    if (! children.length) {
                        control.appendTo(this['_' + type]);
                    } else {
                        
                        var inserted = false;
                        var order = controls[ctrl].ordinal;
                        
                        children.each(function(){
                            
                             var thisOrder = parseInt($(this).attr('data-ordinal'),10);
                            
                             if (order <= thisOrder) {
                                control.insertBefore($(this));
                                inserted = true;
                                return false;
                            }
                            return true;
                        });
                        
                        //if we haven't inserted it, it means its order number is last, so add it to the end of the stack
                        if (! inserted)
                            control.appendTo(this['_' + type]);
                    }
                    
                    
                    //controlPanel
                    if (type === 'controlPanel')
                        control.css('background-color',this.options.controlPanelBackground);
                    
                    if (controls[ctrl].handler) {
                        control.on('click',function(){
                            app._handleControlRequest($(this).attr(dataCtrlAttr));
                        });
                    }
                }        
                
                var attachTo = this._controlPanelSettings[type].attachTo ? this._controlPanelSettings[type].attachTo : this.element;
                
                this['_' + type].attr('data-slideit-namespace',this.eventNamespace).appendTo(attachTo);
                
                if (type === 'controlPanel' && this.options.allowDelayChange) 
                    this._addControlPanel('delayControl');
                
            },
            
            setContainerHeight : function(){
                
                //reset container height responsively
                function respond(){
                    if (this.element.hasClass('slideit-container-responsive'))
                        return;
                    
                    this.element.addClass('slideit-container-responsive');
                    
                    var app = this;
                    
                    $(window).on('resize',function(){
                        app.setContainerHeight();
                        
                    });
                }
                
                var container = this.element;
                var slides = this._slides;
                var app = this;
        
                slides.each(function(){
                    
                    var slide = $(this);
                    
                    //find first visible slide
                    if (! slide.is(':visible'))
                        return true;
                    
                    //is it an image
                    var isAnImage = slide.is('img');
                    
                    //or does the slide contain an image? e.g. if slide is figure
                    if (! isAnImage) {
                        var image = slide.find('img').filter(':first');
                        
                        if (image.length) {
                            slide = image;
                            isAnImage = true;
                        }
                    }
                    
                    loaded = isAnImage === true ? slide.prop('complete') : true;
                    
                    //if a loaded image or standard element, set the height
                    if (loaded) {
                        var slideHeight = slide.height();
                        app.element.height(slideHeight);
                        respond.call(app);
                        return false;
                    }
        
                    //image is not loaded, listen for load event                    
                    slide.on('load',function(){
                        var imgheight = slide.height();
                        
                        app.element.height(imgheight);
                        
                        //remove event
                        slide.off('load');
                        
                        respond.call(app);
                    });
                    
                    return false;
        
                });
            }

        });
        
    })(jQuery);
