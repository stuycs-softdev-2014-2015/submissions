var c = document.getElementById("c");
ctx = c.getContext("2d");



var draw = function(e){
    var x = e.offsetX;
    //console.log(x);
    var y = e.offsetY;

    var red = document.getElementById("red").checked;
    var blue = document.getElementById("blue").checked;
    var yellow = document.getElementById("yellow").checked;
    var erase = document.getElementById("erase").checked;
    
    var circle = document.getElementById("circle").checked;
    var rectangle = document.getElementById("rectangle").checked;

    var small = document.getElementById("small").checked;
    var medium = document.getElementById("medium").checked;
    var large = document.getElementById("large").checked;

    //console.log(red);

    ctx.beginPath();

    var color;
    if (red)
	color="#FF0000";
    else if (blue)
	color="#0000FF";
    else if (yellow)
	color="#FFFF00";
    else
	color="#FFFFFF";
 
    if (circle) {
	if(small)
	    ctx.arc(x,y,7,0,2*Math.PI);
	if(medium)
	    ctx.arc(x,y,12,0,2*Math.PI);
	if(large)
	    ctx.arc(x,y,15,0,2*Math.PI);
    } else if (rectangle){
	if(small)
	    ctx.rect(x,y,12,12);
	if(medium)
	    ctx.rect(x,y,20,20);
	if(large)
	    ctx.rect(x,y,25,25);

    };
    ctx.fillStyle=color;
    ctx.stroke();
    ctx.fill();
};




c.addEventListener("mousedown", draw)
