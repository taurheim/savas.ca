window.onload = function() {
	var buttons = document.getElementsByClassName("url");
	var runDistance = 1;//rad
	var centerX = 300; //based on #main_wrapper
	var centerY = 200;
	for(var b=0;b<buttons.length;b++){
        if (!buttons.hasOwnProperty(b)) continue;
		buttons[b].addEventListener("mouseover", function(){
			for(var b2=0;b2<buttons.length;b2++){
				if(buttons[b2].id != this.id){
					buttons[b2].className += " orbit";
				}
			}
		});

		buttons[b].addEventListener("mouseout",function(){
			for(var b2=0;b2<buttons.length;b2++){
				buttons[b2].className = buttons[b2].className.replace(" orbit","");
			}
		})
	}
}