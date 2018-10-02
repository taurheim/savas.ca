//Store all JSON here as it gets loaded
var json_data = {};
var imageView = new NikoImageView();

window.onload = function() {
  // Data to load: will try to load {root}/{type}.json into json_data[{type}]
  var projectDataRoot = "project_data";
  var projectDataTypes = [
    "project_info",
    "collaborators",
    "libraries",
    "apis"
  ];

  var asyncMethods = {};
  projectDataTypes.forEach(function(name){
    asyncMethods[name] = function(callback) {
      nikoQuery.loadJSON(projectDataRoot + "/" + name + ".json", function(err, data){
        if(err) {
          return callback(err);
        }
        json_data[name] = data;
        return callback();
      });
    }
  });

  nikoQuery.parallel(asyncMethods, function(err){
    displayProjectIcons();
  });

  //Bind buttons on the popup
  function closePopup() {
    n$("#project-grid-wrapper").show();
    n$("#popup-wrapper-outer").hide();
  }
  function openGeneral() {
    n$(".project-technical-description")[0].hide();
    n$(".project-general-description")[0].show();
  }
  function openTechnical() {
    n$(".project-technical-description")[0].show();
    n$(".project-general-description")[0].hide();
  }

  n$("#click-to-close").onClick(closePopup);
  n$("#close-button").onClick(closePopup);
  n$("#tab-general").onClick(openGeneral);
  n$("#tab-technical").onClick(openTechnical);

  //Initialize the image viewer
  imageView.init(n$("#photo-gallery"));
}

function displayProjectIcons(){
  var allProjectsShown = true;
  //Set Global
  for(var i=0;i<json_data["project_info"].length;i++){

    //Load project data
    var project = json_data["project_info"][i];

    //Clone the dummy
    var projectElement = n$("#dummy-project").clone();
    projectElement.removeAttr("id");

    projectElement.children(".project-title")[0].html(project["name"]);
    projectElement.children(".project-description")[0].html(project["short-description"]);

    var imgSrc = "project_data/images/" + project["title"] + "/icon.png"
    projectElement.children(".project-image")[0].attr("src", imgSrc);
    projectElement.children(".bg-img")[0].attr("src", imgSrc);

    //Add icons for github, etc.
    if(project["github"]) {
      var logo = nikoQuery.createElement("img", {"src": "includes/images/github-logo.png"});
      projectElement.children(".project-external")[0].append(logo);
    }
    if(project["devpost"]) {
      var logo = nikoQuery.createElement("img", {"src": "includes/images/devpost-logo.png"});
      projectElement.children(".project-external")[0].append(logo);
    }
    if(project["medium"]) {
      var logo = nikoQuery.createElement("img", {"src": "includes/images/medium-logo.png"});
      projectElement.children(".project-external")[0].append(logo);
    }

    //Flip when front is clicked
    projectElement.children(".front")[0].onClick(flip(projectElement));
    projectElement.children(".front")[0].onTap(flip(projectElement));

    //Open project when you click the back side
    projectElement.children(".back")[0].onClick(displayProject(i));
    projectElement.children(".back")[0].onTap(displayProject(i));

    //Add the div and show it
    n$("#project-grid-wrapper").append(projectElement);

    if (project["highlight"] === true) {
      projectElement.show();
    } else {
      allProjectsShown = false;
    }
  }

  if (!allProjectsShown) {
    var showAllButton = nikoQuery.createElement("h2", {"id": "showAllButton"});
    showAllButton.html("Show all");
    showAllButton.onClick(showHiddenProjects);
    n$("#projects-footer").append(showAllButton);
  }
}

function showHiddenProjects() {
  n$("#project-grid-wrapper").children(".project-block").forEach((element) => {
    if (element.attr("id") !== "dummy-project") {
      n$(element).show();
    }
  });
  n$("#showAllButton").hide();
}

function flip(element){
  return function() {
    unflipAll();
    element.addClass("flipped");
  }
}

function displayProject(projectIndex){
  return function(){
    var projectData = json_data["project_info"][projectIndex];
    var popup = n$("#popup-wrapper-outer");
    popup.show();
    popup.children(".project-general-description")[0].show();
    popup.children(".project-technical-description")[0].hide();
    n$("#project-grid-wrapper").hide();

    //Title/header
    popup.children(".project-title")[0].html(projectData["name"]);
    popup.children(".project-tagline")[0].html(projectData["tagline"]);

    //General Description
    popup.children(".project-general-description")[0].html(projectData["description"]);

    //Images
    imageView.clearView();
    for(var i=0;i<projectData["images"].length;i++){
      var fileName = projectData["images"][i].fileName;
      var imagePath = "project_data/images/" + projectData["title"] + "/" + fileName;
      imageView.addImage(imagePath);
    }

    //Technical Description
    var technical = popup.children(".project-technical-description")[0];
    
    technical.html("Language(s): ");
    for(var i=0;i<projectData["language"].length;i++){
      if(i!=0) technical.append(", ");
      technical.append(projectData["language"][i]);
    }
    technical.append("<br/><br/>");

    buildList("Collaborators", projectData["collab"], json_data["collaborators"], technical);
    buildList("Libraries", projectData["libs"], json_data["libraries"], technical);
    buildList("APIs", projectData["api"], json_data["apis"], technical);

    //External links
    var external = popup.children(".project-external")[0];
    external.html("");
    if(projectData["github"] || projectData["medium"] || projectData["devpost"]){
      external.html("Check it out here: ");
    }

    if(projectData["github"]){
      external.append("<div class='project-external-link'><a href='"+projectData["github"]+"' target='_blank'><img src='includes/images/github-logo.png'><br>GitHub</a></div>");
    }

    if(projectData["medium"]){
      external.append("<div class='project-external-link'><a href='"+projectData["medium"]+"' target='_blank'><img src='includes/images/medium-logo.png'><br>Medium</a></div>");
    }

    if(projectData["devpost"]){
      external.append("<div class='project-external-link'><a href='"+projectData["devpost"]+"' target='_blank'><img src='includes/images/devpost-logo.png'><br>Devpost</a></div>");
    }
  }
}

function clearGallery() {
  n$("#photo-gallery").html("");
}

//Build a list separated by commas
function buildList(listName, keys, data, el){
  if(!keys || !data || !el) return;
  el.append(listName + ": ");
  if(keys.length==0){
    el.append("None");
  }
  for(var i=0;i<keys.length;i++){
    if(i!=0) el.append(", ");
    var key = keys[i];
    if(!data[key]){
      console.log("Couldn't find a reference for: " + key + "(" + listName + ")");
      continue;
    }
    el.append("<a href='" + data[key]["url"] + "'>" + data[key]["name"] + "</a>");
  }
  el.append("<br/><br/>");
}

function unflipAll() {
  var allFlipped = n$(".flipped");

  for(var i=0;i<allFlipped.length;i++){
    allFlipped[i].attr("class", allFlipped[i].element.className.replace(/ ?flipped/, ""));
  }
}