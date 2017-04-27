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
    this.parentElement = parentElement;
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
    var img = document.createElement("img");
    img.setAttribute("class", "niko-image");
    img.setAttribute("src", imageUrl);

    //Bind lightbox
    img.addEventListener("click", this.lightboxImage(imageUrl));

    this.parentElement.appendChild(img);
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
    this.parentElement.innerHTML = "";
  };

  /*
    lightboxImage
    Show a given image in a lightbox
  */
  this.lightboxImage = function(url) {
    var self = this;
    return function() {
      var wrapper = document.createElement("div");
      wrapper.setAttribute("class", "niko-lightbox");
      document.body.appendChild(wrapper);

      var background = document.createElement("div");
      background.setAttribute("class", "black_overlay");

      var foreground = document.createElement("div");
      foreground.setAttribute("class", "white_content");

      var image = document.createElement("img");
      image.setAttribute("src", url);

      var footer = document.createElement("div");
      footer.setAttribute("class", "lightbox-footer");
      footer.innerHTML = self.footerMessage;

      foreground.appendChild(image);
      foreground.appendChild(footer);

      wrapper.appendChild(foreground);
      wrapper.appendChild(background);

      background.addEventListener("click", function() {
        document.body.removeChild(wrapper);
      });
      foreground.addEventListener("click", function() {
        document.body.removeChild(wrapper);
      });
    }
  }
};