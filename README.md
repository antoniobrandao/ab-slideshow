# ab-slideshow

Hyper simple responsive vanilla slideshow using background-image instead of IMG and dynamic creation / removal of dom elements.

Necessary arguments:

- array of image URLs
- reference to parent element which will hold the images

This slideshow doesn't require markup. No need to add the images to the DOM before calling it.

Just set targetElement to the element where you want your slideshow to be, and while the slideshow progresses, DOM elements will be automatically added and removed to display the images.


## How it works

IMG tags are not used. Instead, each slide element is a dynamically created DIV with the CSS property "background-image" set to "(url_of_image) no-repeat center center fixed" - and the CSS property "background-size" set to 'cover'. This is done to ensure perfect fitting of the image at any size of the parent element holding the slideshow. Handy for responsive design. You can resize the parent element as you wish, the images will always cover the available area in the best possible fit.

No CSS is needed from you (except for the parent element). The slideshow and the slides automatically adopt the width and height of the parent element, which is the required parameter "targetElement". Please ensure the "targetElement" has the size you need it to have.

When the slideshow starts, it creates a DIV in the given targetElement (using appendChild), with it's background-image property set to the URL of the image file, it's background-size property to 'cover' and opacity 1.

Each time the slideshow transitions to a new image, a new DIV is created on top of the current one, with it's background-image set to the URL of the next image file, and with opacity 0. CSS transitions are then activated in the new DIV and it's opacity set to 1, making the DIV fade in. When the new DIV finishes fading in, the previous DIV is removed from the DOM. 

###Roadmap:

- Priority:
  - Loading images discreetly
- Maybe:
  - Previous / Next functionality
  - Circles showing current position


## Install

With [npm](http://npmjs.org) do:

```bash
$ npm install ab-slideshow --save-dev
```

## Usage

    var slideshow = require("ab-slideshow");

    // Basic usage

    var new_slideshow = new slideshow({
        images: ['path/img1.png', 'path/img2.jpg'],
        targetElement: document.getElementById('slideshow-container')
    });

    // Advanced usage

    var new_slideshow = new slideshow({
        images: ['path/img1.png', 'path/img2.jpg'],
        targetElement: document.getElementById('slideshow-container')
        transitionDuration: 1.5, // in seconds
        slideDuration: 4, // in seconds
        autoStart: true, // if false, only first image is shown. then call slideshow.start()
        onSlideChange: null, // callback for each slide change. returns current slide index
        debug: true, // displays useful console.logs
        startIndex: 0, // option to select initial slide index
        classes: ['some-class'] // classes in this array will be added to each slide
    });

    // methods
    slideshow.pause() - pauses the slideshow
    slideshow.start() - starts / unpauses the slideshow
    slideshow.destroy() - stops the slideshow looping and removes any added images from the DOM

    // getters
    slideshow.currentSlide - returns current slide index
    slideshow.currentSlideElement - returns current slide element

## License

MIT
