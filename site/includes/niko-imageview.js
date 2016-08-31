/*
  Tiny custom library to display a set of images with a scrollbar using mostly css
*/

var NikoImageView = function() {
  this.parentElement;
  this.imageUrls = [];

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
    this.parentElement.innerHTML += "<img src='" + imageUrl + "'>";
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
  };
};