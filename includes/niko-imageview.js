/*
  Tiny custom library to display a set of images with a scrollbar using mostly css
*/

var NikoImageView = function() {
  this.parentElement;
  this.imageUrls = [];
  this.footerMessage = "Click or tap anywhere to close.";

  /*
    init
    Turn a div of images into an imageviewer
    @param parentElement Div to turn into an image viewer. CSS should already exist to dictate the size of the images.
  */
  this.init = function(parentElement) {
    this.parentElement = n$(parentElement);
    //Add wrappers to each image
    //Add arrows
    //Bind arrows
  };

  /*
    addImage
    Add an image to the gallery
    @param imageUrl Url to put in the src attribute of the <img> tag
  */
  this.addImage = function(imageUrl) {
    var image = nikoQuery.createElement("img", {
      "class": "niko-image",
      "src": imageUrl
    });
    image.onClick(this.lightboxImage(imageUrl));
    this.parentElement.append(image);
  };

  /*
    removeImage
    Remove an image from the gallery. Will do nothing if the image doesn't exist.
    @param imageUrl Url to remove from the gallery
  */
  this.removeImage = function(imageUrl) {
  };

  /*
    clearView
    Remove all images from the view
  */
  this.clearView = function() {
    this.parentElement.html("");
  };

  /*
    lightboxImage
    Show a given image in a lightbox
  */
  this.lightboxImage = function(url) {
    var self = this;
    return function() {
      var wrapper = nikoQuery.createElement("div", {"class": "niko-lightbox"});
      n$("body").append(wrapper);

      var background = nikoQuery.createElement("div", {"class": "black_overlay"});
      var foreground = nikoQuery.createElement("div", {"class": "white_content"});
      var image = nikoQuery.createElement("img", {"src": url});
      var footer = nikoQuery.createElement("div", {"class", "lightbox-footer"});

      // Put it all together
      footer.html(self.footerMessage);
      foreground.append(image);
      foreground.append(footer);
      wrapper.append(foreground);
      wrapper.append(background);

      background.onClick(function() {
        wrapper.remove();
      });

      foreground.onClick(function() {
        wrapper.remove();
      });
    }
  }
};