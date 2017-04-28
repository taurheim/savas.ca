var n$ = function(selector) {
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
	};

	if (typeof selector == "string"){
		// Type 1: string selector
		var selectorChar = selector.charAt(0);
		var selectorQuery = selector.substring(1);
		switch (selectorChar) {
			case "#":
				return n$(document.getElementById(selectorQuery));
			case ".":
				elementsFound = document.getElementsByClassName(selectorQuery);
				n$Elements = []
				for (var i=0;i<elementsFound.length;i++) {
					n$Elements.push(n$(elementsFound[i]));
				}
				return n$Elements;
		}
	} else {
		// Type 2: given a DOM node (for now, no error checking)
		return new n$Element(selector);
	}
}

var nikoQuery = {
	createElement: function(type, attrs) {
		var newElement = n$(document.createElement(type);

		for (var attrName in attrs) {
			newElement.attr(attrName, attrs[attrName]);
		}
	},
	loadJSON: function(path, success, error) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()	{
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
}