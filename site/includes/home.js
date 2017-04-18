/*
 * Array of ids associated with the links around the middle.
 * This is used to determine which direction to move icons when hovered.
 * The clock should begin with at 12:00 and go clockwise.
*/
var linkClock = ["url-projects", "url-blog", "icon-linkedin", "icon-github", "url-resume"];

window.onload = function() {
	var buttons = document.getElementsByClassName("url");

	for(var b=0;b<buttons.length;b++){
        if (!buttons.hasOwnProperty(b)) continue;
		buttons[b].addEventListener("mouseover", orbitOthersAwayFrom(buttons[b], buttons));

		buttons[b].addEventListener("mouseout",function(){
			for(var b2=0;b2<buttons.length;b2++){
				removeOrbit(buttons[b2]);
			}
		})
	}
}

function orbitOthersAwayFrom(el, buttons) {
	return function() {
		for(var b2=0;b2<buttons.length;b2++){
			if(buttons[b2].id != el.id){
				buttons[b2].className += " " + getOrbitDirection(el, buttons[b2]);
			}
		}
	}
}

// Returns either "orbit-clockwise" or "orbit-counterclockwise"
function getOrbitDirection(hoveredElement, orbitingElement) {
	var hoverClockIndex = linkClock.indexOf(hoveredElement.id);
	var orbitClockIndex = linkClock.indexOf(orbitingElement.id);

	var halfClock = parseInt(linkClock.length/2);

	//Move around the clock and assign clockwise values
	for(var i=1;i<=halfClock;i++){
		if((hoverClockIndex + i)%linkClock.length == orbitClockIndex) {
			return "orbit-clockwise";
		}
	}

	return "orbit-counterclockwise";
}

function removeOrbit(el) {
	el.className = el.className.replace(/ ?orbit[^ ]*/, "");
}

function getCenter(el) {
	var dim = el.getBoundingClientRect();
	var x = dim.left + dim.width/2;
	var y = dim.top + dim.height/2;
	return {
		"x": x,
		"y": y
	}
}