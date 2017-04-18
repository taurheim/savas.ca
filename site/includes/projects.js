//Store all JSON here as it gets loaded
var json_data = {};
var imageView = new NikoImageView();

window.onload = function() {
  //Load all json data files
  //Technically we don't need to wait for collab, libs, or apis to finish before displaying
  var loaded = 0;
  var toLoad = 4;
  var parallelLoad = function(){
    loaded++;
    if(loaded == toLoad) displayProjectIcons();
  }
  loadJSON('project_data/project_info.json', function(data){json_data["project_info"] = data;parallelLoad();},function(xhr) { console.error(xhr); });
  loadJSON('project_data/collaborators.json', function(data){json_data["collaborators"] = data;parallelLoad();},function(xhr) { console.error(xhr); });
  loadJSON('project_data/libraries.json', function(data){json_data["libraries"] = data;parallelLoad();},function(xhr) { console.error(xhr); });
  loadJSON('project_data/apis.json', function(data){json_data["apis"] = data;parallelLoad();},function(xhr) { console.error(xhr); });

  //Bind buttons on the popup
  function closePopup() {
    showElement(document.getElementById("project-grid-wrapper"));
    hideElement(document.getElementById("popup-wrapper-outer"));
  }
  document.getElementById("click-to-close").addEventListener("click", closePopup);
  document.getElementById("close-button").addEventListener("click", closePopup);
  document.getElementById("tab-general").addEventListener("click", function(){
    hideElement(document.getElementsByClassName("project-technical-description")[0]);
    showElement(document.getElementsByClassName("project-general-description")[0]);
  });
  document.getElementById("tab-technical").addEventListener("click", function(){
    hideElement(document.getElementsByClassName("project-general-description")[0]);
    showElement(document.getElementsByClassName("project-technical-description")[0]);
  });

  //Initialize the image viewer
  imageView.init(document.getElementById("photo-gallery"));
}

function displayProjectIcons(){
  //Set Global
  for(var i=0;i<json_data["project_info"].length;i++){

    //Load project data
    var project = json_data["project_info"][i];

    //Clone the dummy
    var projectElement = document.getElementById("dummy-project").cloneNode(true);
    projectElement.removeAttribute("id");

    //Build the div
    setValue(projectElement, "project-title", project["name"]);
    setValue(projectElement, "project-description", project["short-description"]);
    setImage(projectElement, "project-image", "project_data/images/" + project["title"] + "/icon.png");
    setImage(projectElement, "bg-img", "project_data/images/" + project["title"] + "/icon.png");

    //Add icons for github, etc.
    if(project["github"]) appendImageToChild(projectElement, "project-external", "includes/images/github-logo.png");
    if(project["devpost"]) appendImageToChild(projectElement, "project-external", "includes/images/devpost-logo.png");
    if(project["medium"]) appendImageToChild(projectElement, "project-external", "includes/images/medium-logo.png");

    //Flip when front is clicked
    projectElement.getElementsByClassName("front")[0].addEventListener("click", flip(projectElement));
    tapEventListener(projectElement.getElementsByClassName("front")[0], flip(projectElement));

    //Open project when you click the back side
    projectElement.getElementsByClassName("back")[0].addEventListener("click", displayProject(i));
    tapEventListener(projectElement.getElementsByClassName("back")[0], displayProject(i));

    //Add the div and show it
    document.getElementById("project-grid-wrapper").appendChild(projectElement);
    showElement(projectElement);
  }
}

function tapEventListener(el, callback) {
  var touchmoved;
  el.addEventListener("touchstart", function() {
    touchmoved = false;
  });
  el.addEventListener("touchmove", function() {
    touchmoved = true;
  });
  el.addEventListener("touchend", function(e){
    if (!touchmoved) {
      callback(e);
    }
  });
}

function flip(element){
  return function() {
    unflipAll();
    element.className += " flipped";
  }
}

function displayProject(projectIndex){
  return function(){
    var projectData = json_data["project_info"][projectIndex];
    var popup = document.getElementById("popup-wrapper-outer");
    showElement(popup);
    showElement(popup.getElementsByClassName("project-general-description")[0]);
    hideElement(popup.getElementsByClassName("project-technical-description")[0]);
    hideElement(document.getElementById("project-grid-wrapper"));

    //Title/header
    setValue(popup, "project-title", projectData["name"]);
    setValue(popup, "project-tagline", projectData["tagline"]);

    //General Description
    setValue(popup, "project-general-description", projectData["description"]);

    //Images
    imageView.clearView();
    for(var i=0;i<projectData["images"].length;i++){
      var fileName = projectData["images"][i].fileName;
      var imagePath = "project_data/images/" + projectData["title"] + "/" + fileName;
      imageView.addImage(imagePath);
    }

    //Technical Description
    var technical = popup.getElementsByClassName("project-technical-description")[0];
    
    technical.innerHTML = "Language(s): ";
    for(var i=0;i<projectData["language"].length;i++){
      if(i!=0) technical.innerHTML+= ", ";
      technical.innerHTML += projectData["language"][i];
    }
    technical.innerHTML += "<br/><br/>";
    buildList("Collaborators", projectData["collab"], json_data["collaborators"], technical);
    buildList("Libraries", projectData["libs"], json_data["libraries"], technical);
    buildList("APIs", projectData["api"], json_data["apis"], technical);

    //External links
    var external = popup.getElementsByClassName("project-external")[0];
    external.innerHTML = "";
    if(projectData["github"]){
      external.innerHTML = "Check it out here: ";
    }

    if(projectData["github"]){
      external.innerHTML += "<div class='project-external-link'><a href='"+projectData["github"]+"' target='_blank'><img src='includes/images/github-logo.png'>GitHub</a></div>";
    }
  }
}

function clearGallery() {
  document.getElementById("photo-gallery").innerHTML = "";
}

//Build a list separated by commas
function buildList(listName, keys, data, el){
  if(!keys || !data || !el) return;
  el.innerHTML += listName + ": ";
  if(keys.length==0){
    el.innerHTML += "None"
  }
  for(var i=0;i<keys.length;i++){
    if(i!=0) el.innerHTML+= ", ";
    var key = keys[i];
    if(!data[key]){
      console.log("Couldn't find a reference for: " + key + "(" + listName + ")");
      continue;
    }
    el.innerHTML += "<a href='" + data[key]["url"] + "'>" + data[key]["name"] + "</a>";
  }
  el.innerHTML += "<br/><br/>";
}

function unflipAll() {
  var allFlipped = document.getElementsByClassName("flipped");

  for(var i=0;i<allFlipped.length;i++){
    allFlipped[i].className = allFlipped[i].className.replace(/ ?flipped/, "");
  }
}

function appendImage(el, src) {
  el.innerHTML += "<img src='" + src + "'>";
}
function appendImageToChild(element, className, src){
  appendImage(element.getElementsByClassName(className)[0], src);
}

function setValue(element, className, value){
  element.getElementsByClassName(className)[0].innerHTML = value;
}

function appendValueToChild(element, className, value){
  element.getElementsByClassName(className)[0].innerHTML += value;
}

function setImage(element, className, src){
  element.getElementsByClassName(className)[0].src = src;
}

function showElement(el){
  el.style.display = "";
  el.className = el.className.replace(/ ?hidden/, "");
}

function hideElement(el){
  if(el.className.indexOf("hidden") == -1 ){
    el.className += " hidden";
  }
}

function loadJSON(path, success, error)
{
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function()
  {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success) success(JSON.parse(xhr.responseText));
      } else {
        if (error) error(xhr);
      }
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}