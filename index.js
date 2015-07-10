'use strict';

function ABSlideshow(options)
{
    if (!(this instanceof ABSlideshow)) {
        return new ABSlideshow(options);
    }
    
    var self = this;

    this.settings = {
        images              : [],
        targetElement       : null,
        transitionDuration  : 1.5, // in seconds
        slideDuration 		: 10, // in seconds
        showButtons 		: false,
        autoStart 			: true,
        parent              : null,
        onReady             : null,
        onSlideChange       : null,
        debug               : true,
        startIndex          : 0,
        classes             : [],
        properties          : {},
    };

    if (this.debug) { console.log('::: ABSlideshow :::'); };

    this.settings   = this.extend(this.settings, options);
    this.debug      = this.settings.debug;
    this.interval 	= {};
    this.currentSlideElement = {};
    this.currentIndex = this.settings.startIndex;

    if (this.settings.targetElement) {
    	this.init();  	
    } else {
    	if (this.debug) { console.log('ABSlideshow ::: no targetElement provided, cannot init'); };
    }
}

ABSlideshow.prototype.init = function init()
{
    if (this.debug) { console.log('ABSlideshow.prototype.init'); };

    var new_element = this.prepareNewElementAtIndex(this.currentIndex, true);

    this.settings.targetElement.appendChild(new_element);

    this.currentSlideElement = new_element;

	if (this.settings.autoStart) {
		this.start();
	};    
}

ABSlideshow.prototype.start = function start()
{
    if (this.debug) { console.log('ABSlideshow.prototype.start'); };

    var self = this;

    this.interval = setInterval(function()
	{
	    if (self.debug) { console.log('ABSlideshow.prototype.processInterval'); };

	    self.currentIndex = self.currentIndex + 1;
	    if (self.currentIndex === self.settings.images.length) { self.currentIndex = 0 };

	    var new_element = self.prepareNewElementAtIndex(self.currentIndex);

	    self.settings.targetElement.appendChild(new_element);

	    var td = (self.settings.transitionDuration + 0.1) * 1000;

	    var old_slide = self.currentSlideElement;

	    self.currentSlideElement = new_element;

	    setTimeout(function()
	    {
	    	new_element.style.opacity = 1;
	    }, 100);
    	
    	setTimeout(function()
	    {
	    	old_slide.parentNode.removeChild(old_slide);
	    }, td);
    
	}, self.settings.slideDuration * 1000);
}

ABSlideshow.prototype.pause = function pause()
{
    if (this.debug) { console.log('ABSlideshow.prototype.pause'); };

    clearInterval(this.interval);
}

ABSlideshow.prototype.destroy = function destroy()
{
    if (this.debug) { console.log('ABSlideshow.prototype.destroy'); };

    clearInterval(this.interval);
    
    if (this.currentSlideElement) {
    	if (this.currentSlideElement.parentNode) {
    		this.currentSlideElement.parentNode.removeChild(this.currentSlideElement);
    	};
    	this.currentSlideElement = null;
    };
}


//   ## ##                ######  ##    ##  ######  
//   ## ##               ##    ##  ##  ##  ##    ## 
// #########             ##         ####   ##       
//   ## ##                ######     ##     ######  
// #########                   ##    ##          ## 
//   ## ##               ##    ##    ##    ##    ## 
//   ## ##                ######     ##     ######  



ABSlideshow.prototype.prepareNewElementAtIndex = function prepareNewElementAtIndex(index, visible)
{
    if (this.debug) { console.log('ABSlideshow.prototype.prepareNewElementAtIndex'); };

    var imageURLAtIndex = this.settings.images[index];

    var new_element = document.createElement('DIV');

    new_element.style.position 				= 'absolute';
    new_element.style.top 					= '0px';
    new_element.style.left 					= '0px';
    new_element.style.height 				= this.settings.targetElement.clientHeight + 'px';
    new_element.style.width 				= this.settings.targetElement.clientWidth  + 'px';
    new_element.style.background 			= 'url(' + imageURLAtIndex + ') no-repeat center center fixed'
	new_element.style.webkitBackgroundSize 	= 'cover';
	new_element.style.mozBackgroundSize 	= 'cover';
	new_element.style.oBackgroundSize 		= 'cover';
	new_element.style.backgroundSize 		= 'cover';

	if (visible) {  new_element.style.opacity = 1; console.log('1');
	} else 		 {  new_element.style.opacity = 0; console.log('2');
	}

	// add css transition for fading
    var transition_value 					= 'all ' + this.settings.transitionDuration + 's ease-out';
    new_element.style.webkitTransition   	= transition_value;
    new_element.style.mozTransition      	= transition_value;
    new_element.style.msTransition       	= transition_value;
    new_element.style.oTransition        	= transition_value;

	return new_element;
}


ABSlideshow.prototype.extend = function extend( defaults, options ) 
{
	var extended = {};
	var prop;

	for (prop in defaults) 
	{
		if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
			extended[prop] = defaults[prop];
		}
	}

	for (prop in options) 
	{
		if (Object.prototype.hasOwnProperty.call(options, prop)) 
		{
			extended[prop] = options[prop];
		}
	}
	return extended;
};

module.exports = ABSlideshow;