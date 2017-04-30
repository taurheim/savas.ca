/*
	TODO better encapsulation of these methods
*/

var n$Element = function(el) {
	this.element = el;

	this.show = function() {
		el.style.display = "";
		el.className = el.className.replace(/ ?hidden/, "");
	}

	this.hide = function() {
		if(el.className.indexOf("hidden") == -1 ){
			el.className += " hidden";
		}
	}

	this.onClick = function(callback) {
		el.addEventListener("click", callback);
	}

	this.onTap = function(callback) {
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

	this.clone = function() {
		return n$(el.cloneNode(true));
	}

	this.html = function(html) {
		el.innerHTML = html;
	}

	this.append = function(toAppend) {
		if (typeof toAppend == "string") {
			el.innerHTML += toAppend;
		} else {
			//Assume DOM node
			el.appendChild(toAppend.element);
		}
	}

	this.remove = function() {
		el.parentNode.removeChild(el);
	}

	this.attr = function(attrName, value) {
		if (value !== undefined) {
			el.setAttribute(attrName, value);
		} else {
			return el.getAttribute(attrName);
		}
	}

	this.removeAttr = function(attrName) {
		el.removeAttribute(attrName);
	}

	this.children = function(selector) {
		return findElement(selector, el);
	}

	this.addClass = function(className) {
		el.className += " " + className;
	}

	this.removeClass = function(className) {
		el.className = el.className.replace(/ ?className/, "");
	}
};

//TODO need a new name for selector that's more explicit
var findElement = function(selector, parentDOM) {
	if (typeof selector == "string"){
		// Type 1: string selector
		var selectorChar = selector.charAt(0);
		var selectorQuery = selector.substring(1);
		switch (selectorChar) {
			case "#":
				return n$(document.getElementById(selectorQuery));
			case ".":
				elementsFound = parentDOM.getElementsByClassName(selectorQuery);
				n$Elements = []
				for (var i=0;i<elementsFound.length;i++) {
					n$Elements.push(n$(elementsFound[i]));
				}
				return n$Elements;
			default:
				// Get element(s) by name
				elementsFound = parentDOM.getElementsByTagName(selector);
				n$Elements = []
				for (var i=0;i<elementsFound.length;i++) {
					n$Elements.push(n$(elementsFound[i]));
				}
				return n$Elements;
		}
	} else if (selector instanceof n$Element) {
		return selector;
	} else {
		// Type 2: given a DOM node (for now, no error checking)
		return new n$Element(selector);
	}
};

var n$ = function(selector) {
	return findElement(selector, document);
}

var nikoQuery = {
	createElement: function(type, attrs) {
		var newElement = n$(document.createElement(type));

		for (var attrName in attrs) {
			newElement.attr(attrName, attrs[attrName]);
		}

		return newElement;
	},
	loadJSON: function(path, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()	{
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					callback(null, JSON.parse(xhr.responseText));
				} else {
					callback(xhr);
				}
			}
		};
		xhr.open("GET", path, true);
		xhr.send();
	},
	/*
		Execute callback once all of the provided asyncMethods have returned.
		TODO return data based on output of each of the methods
		@param asyncMethods Dictionary of methods to run. Each method should have the
			signature: function(callback) where callback: function(err)
		@param callback Call once all asyncMethods have completed
	*/
	parallel: function(asyncMethods, callback) {
		var loaded = 0;
		var toLoad = Object.keys(asyncMethods).length;

		var finishedLoading = function(err) {
			if(err) {
				callback(err);
			} else {
				loaded++;
				if (loaded == toLoad) callback(null);
			}
		}

		for (var methodName in asyncMethods) {
			asyncMethods[methodName](finishedLoading);
		}
	}
}