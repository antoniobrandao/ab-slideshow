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
        slideDuration       : 4, // in seconds
        autoStart           : true,
        active              : false,
        onSlideChange       : null,
        debug               : false,
        startIndex          : 0,
        classes             : [],
        flags_delay         : [],
        // showButtons      : false, // maybe add this feature later
    };

    if (this.settings.debug) { console.log(' ::: ABSlideshow ::: '); };

    this.settings   = this.extend(this.settings, options);
    this.interval   = {};

    var ok_to_start = true;

    this.starting = true;

    if (!this.settings.targetElement) {
        ok_to_start = false;
        if (this.settings.debug) { console.log('ABSlideshow ::: no targetElement provided, cannot work'); };
    }

    if (!this.settings.images || this.settings.images.length <= 0) {
        ok_to_start = false;
        if (this.settings.debug) { console.log('ABSlideshow ::: no images array provided, cannot work'); };
    }

    if (ok_to_start) { if (this.settings.autoStart) { this.start(); };
    } else { if (this.settings.debug) { console.log('ABSlideshow ::: ok_to_start false'); }; }
}

ABSlideshow.prototype.start = function start()
{
    if (this.settings.debug) { console.log('ABSlideshow.prototype.start'); };

    if (!this.settings.active)
    {
        this.settings.active = true;

        var self = this;
        var removePreviousElement_delay = (this.settings.transitionDuration + 0.8) * 1000;

        // ensure at least relative positioning in targetElement
        var dastyle  = window.getComputedStyle(self.settings.targetElement);
        var position = dastyle.getPropertyValue('position');
        if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
            self.settings.targetElement.style.position = 'relative';
        }

        var executeSlideshowLoop = function()
        {
            if (self.settings.debug) { console.log('ABSlideshow.prototype.processInterval'); };

            if (self.settings.active)
            {
                var apply_delay = false;

                for (var i = 0; i <= self.settings.flags_delay.length - 1; i++)
                {
                    if (window[self.settings.flags_delay[i]] === true) {
                        apply_delay = true;
                    };
                }

                if (apply_delay) {
                    setTimeout(function() {
                        if (self.settings.active) {
                            executeSlideshowLoop();
                        };
                    }, 2000);
                }
                else
                {
                    if (self.starting) { // starting first time

                        if (self.settings.debug) { console.log('ABSlideshow.prototype.processInterval ::: starting looping') };

                        self.starting = false;

                        // set currentIndex
                        self.currentIndex = self.settings.startIndex;

                        // prepare new slide
                        var new_element = self.prepareNewElementAtIndex(self.currentIndex, true);

                        // add it to the parent
                        self.settings.targetElement.appendChild(new_element);
                    }
                    else // normal loop
                    {
                        if (self.settings.debug) { console.log('ABSlideshow.prototype.processInterval ::: normal loop') };

                        // set currentIndex
                        self.currentIndex = self.currentIndex + 1;
                        if (self.currentIndex === self.settings.images.length) { self.currentIndex = 0 };

                        // prepare new slide
                        var new_element = self.prepareNewElementAtIndex(self.currentIndex);

                        // add it to the parent
                        self.settings.targetElement.appendChild(new_element);

                        // remove previous after delay
                        setTimeout(function() {
                            self.settings.targetElement.firstChild.parentNode.removeChild(self.settings.targetElement.firstChild);
                        }, removePreviousElement_delay);
                    }

                    if (self.settings.debug) { console.log('ABSlideshow.prototype.processInterval ::: self.currentIndex: ' + self.currentIndex); };

                    // call new slide if slideshow is still active
                    setTimeout(function() {
                        if (self.settings.active) {
                            executeSlideshowLoop();
                        };
                    }, removePreviousElement_delay + (self.settings.slideDuration * 1000));

                    setTimeout(function()
                    {
                        if (self.settings.active) {
                            // call onChange callback is given in parameters
                            if (self.settings.onSlideChange) {
                                self.settings.onSlideChange(self.currentIndex);
                            };

                            // show new slide
                            new_element.style.opacity = 1;

                            self.currentSlideElement = new_element;
                        };
                    }, 400);
                }
            };
        };

        executeSlideshowLoop();
    }
}

ABSlideshow.prototype.pause = function pause()
{
    if (this.settings.debug) { console.log('ABSlideshow.prototype.pause'); };

    this.settings.active = false;
}

ABSlideshow.prototype.destroy = function destroy()
{
    if (this.settings.debug) { console.log('ABSlideshow.prototype.destroy'); };

    this.settings.active = false;

    while (this.settings.targetElement.firstChild) {
        this.settings.targetElement.removeChild(this.settings.targetElement.firstChild);
    }
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
    if (this.settings.debug) {
        console.log('ABSlideshow.prototype.prepareNewElementAtIndex');

        console.log('prepareNewElementAtIndex');
        console.log('index: ' + index);
    };

    var imageURLAtIndex = this.settings.images[index];
    if (this.settings.debug) { console.log('imageURLAtIndex: ' + imageURLAtIndex); };

    var new_element = document.createElement('DIV');

    new_element.style.overflow                  = 'hidden';
    new_element.style.position                  = 'absolute';
    new_element.style.top                       = '0px';
    new_element.style.left                      = '0px';
    new_element.style.height                    = '100%';
    new_element.style.width                     = '100%';
    new_element.style.background                = 'url(' + imageURLAtIndex + ') no-repeat center center'
    new_element.style.webkitBackgroundSize      = 'cover';
    new_element.style.mozBackgroundSize         = 'cover';
    new_element.style.oBackgroundSize           = 'cover';
    new_element.style.backgroundSize            = 'cover';
    new_element.style.webkitTransform           = 'translate3d(0, 0, 0.00001)';
    new_element.style.mozTransform              = 'translate3d(0, 0, 0.00001)';
    new_element.style.msTransform               = 'translate3d(0, 0, 0.00001)';
    new_element.style.oTransform                = 'translate3d(0, 0, 0.00001)';
    new_element.style.transform                 = 'translate3d(0, 0, 0.00001)';
    new_element.style.webkitBackfaceVisibility  = 'hidden';
    new_element.style.mozBackfaceVisibility     = 'hidden';
    new_element.style.msBackfaceVisibility      = 'hidden';
    new_element.style.oBackfaceVisibility       = 'hidden';
    new_element.style.backfaceVisibility        = 'hidden';
    new_element.style.webkitPerspective         = '1000';
    new_element.style.mozPerspective            = '1000';
    new_element.style.msPerspective             = '1000';
    new_element.style.oPerspective              = '1000';
    new_element.style.Perspective               = '1000';

    if (visible) {  new_element.style.opacity = 1;
    } else       {  new_element.style.opacity = 0;
    }

    // add css transition for fading
    var transition_value                    = 'all ' + this.settings.transitionDuration + 's ease-out';
    new_element.style.webkitTransition      = transition_value;
    new_element.style.mozTransition         = transition_value;
    new_element.style.msTransition          = transition_value;
    new_element.style.oTransition           = transition_value;

    // add any given classes to the new slide element
    for (var i = this.settings.classes.length - 1; i >= 0; i--) {
        if (i === 0) { new_element.className = new_element.className + this.settings.classes[i] }
        else { new_element.className = new_element.className + ' ' + this.settings.classes[i] };
    };

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
