var svg = document.getElementById("c");
var stripPX = function(pixc){
    return parseInt(pixc.slice(0,-2));
}
var svgStyle = window.getComputedStyle(svg);
var maxx = stripPX(svgStyle.width);
var maxy = stripPX(svgStyle.height);
var pmaxy = maxy-20;
var pminy = 20;
//console.log(maxx,maxy);
var nopause = true;

var getRandColor = function(){
    var letters = "0123456789ABCDEF".split('');
    var color = "#";
    for (var i=0;i<6;i++){
	color += letters[Math.floor(Math.random()*letters.length)];
    }
    return color;
};

var buildBlock = function(s,x,y,w,h){
    var rec = document.createElementNS("http://www.w3.org/2000/svg","rect");
    var remove = false;
    return {
	x:x,
	y:y,
	w:w,
	h:h,
	s:s,
	dx:-6,
	draw:function(){
	    rec.setAttribute("x", this.x);
	    rec.setAttribute("y", this.y);
	    rec.setAttribute("width", this.w);
	    rec.setAttribute("height", this.h);
	    //rect class in html file; all blocks should be of similar style
	    rec.setAttribute("class", "rect"); 
	    this.s.appendChild(rec);
	},
	move:function(){
	    //figure out algorithm to adjust movements of block
	    this.x += this.dx;
	    console.log(this.x, this.w);
	    if (this.x+this.w <= 0){
		//this.s.parentNode.removeChild(rec);   //if child is of screen, element is deleted from svg
		this.remove = true; // send boolean so we can remove this block from block list
	    }
	    if (this.w == 0){
		console.log(this.x, this.w);
	    }
	},
	remove:remove,
	node:rec,
    }
}
var addPlayer = function(s,x,y){
    //temporary player is a circle for now
    var cir = document.createElementNS("http://www.w3.org/2000/svg","circle");
    var charwidth = 70+10;//radius + offset pixel (left)
    return {
	s:s,
	x:x,
	y:y,
	dy:8,
	//0=moving along bottom, 1=switching to top, 2=moving along top, 3=switching to bottom
	state:3,
	draw:function(){
	    var c = getRandColor();
	    cir.setAttribute("cx",this.x);
	    cir.setAttribute("cy",this.y);
	    cir.setAttribute("r","20");
	    cir.setAttribute("fill",this.c);
	    this.s.appendChild(cir);
	},
	move:function(){
//	    console.log(this.state);
	    if (this.state == 0) {
		var i = 1;
		if (blocks[0].y !=0){
		    i = 0;
		}//else, by default, the block we should check should be the other one
		if (this.y >= pmaxy){ // specifically blocks alternate in this setup
		    //console.log(blocks[i]);
		    if (blocks[i].x > charwidth){
			this.state = 4;
		    }else{
			this.y = pmaxy;
		    }
		    
		}
	    }
	    if (this.state == 1) {
	   	this.y = this.y - this.dy;
	   	//fix if statements to detect blocks
	   	if (this.y < pminy){
		    this.state = 2;
		}
	    }
	    else if (this.state == 2) {
		var i = 1;
		if (blocks[0].y == 0){
		    i = 0;
		}//else, by default, the block we should check should be the other one
		if (this.y <= pminy){
		    if (blocks[i].x > charwidth){
			this.state = 5;
		    }else{
			this.y = pminy;
		    }
		}
	    }
	    else if (this.state == 3) {
		this.y = this.y + this.dy;
		if (this.y > pmaxy){
	   	    this.state = 0;
		}
	    }
	    else if (this.state == 4){
		//alert("stop");
		this.y = this.y + this.dy;
	    }
	    else if (this.state == 5){
		this.y = this.y - this.dy;
	    }
	},

	node:cir,
	
    }
}
var spawnBlock = function(s,x,y,w,h){
       blocks.push(buildBlock(s,x,y,w,h));
}
var flipGravity = function(e ){
    if (e.keyCode == 32){
	console.log("SpaceBar hit");
	//flip gravity of player here
	if (player.state == 0) {
		player.state = 1;
	}
	if (player.state == 2) {
		player.state = 3;
	}
    }
}
var update = function(){
    //clear screen by clearing svg
    var fnode = svg.firstChild;
    while(fnode){
	svg.removeChild(fnode);
	fnode = svg.firstChild;
    }
    //player action
    player.move();
    player.draw();
    // adds all blocks
    var removeindex = [];
    for (var i = 0; i < blocks.length; i++){
    	blocks[i].move();
    	blocks[i].draw();
    	if (blocks[i].x <= 30) {
    	    //upper
    	    if (blocks[i].y < maxy / 2) {
    		pminy = blocks[i].h + 20;
    	    }
    	    else {
    		pmaxy = maxy - blocks[i].h - 20;
    	    }
    	}
	if (blocks[i].remove){
	    // push index to remove list if block is out of position
	    removeindex.push(i);
	}
    }
    //remove all removable blocks from block list
    for (var ind = removeindex.length; ind>0; ind--){
	blocks.splice(removeindex[ind],1);
    }
//    console.log(blocks);
    if (nopause){
	document.removeEventListener("click",resume);  // temporary... doesnt stop the animation
	window.requestAnimationFrame(update);
    }else{
	document.removeEventListener("click",pausescreen);  // temporary... doesnt stop the animation
	document.addEventListener("click",resume);
    }
}
var resume = function(e){
    nopause= !nopause;
    document.addEventListener("click",pausescreen);  // temporary... doesnt stop the animation
    window.requestAnimationFrame(update);
}
/* pause screen doesnt work right now */
var pausescreen = function(e){
    //svg.removeEventListener("onmouseover",setmovingBlocks());
    window.cancelAnimationFrame(update);
//    console.log("paused??");
    nopause= !nopause;
//    document.removeEventListener("click",pausescreen);
  
}
var setmovingBlocks = function(e){
    setInterval(function(){
	var randw = 500;
	if (blocks.length > 0){
	    var b = blocks[blocks.length-1];
	    if (b.x+b.w-150 < maxx){
		if (b.y == 0){
		    spawnBlock(svg,maxx,maxy-60,randw+0,60);
		}else{
		    spawnBlock(svg,maxx,0,randw,60);
		}
	    }
	}
    },700);
};

//Initialize everything below
var initialize = function(){
    var randy= Math.random()*50;
    var randwid = Math.random()*(maxx);
    spawnBlock(svg,100,maxy-60,maxx,60)
    spawnBlock(svg,300,0,maxx,60);
    //while (blocks[0].x + blocks[0].w > maxx*.75){}
    svg.addEventListener("onmouseover",setmovingBlocks());
    document.addEventListener("click",pausescreen);  // temporary... doesnt stop the animation
    document.addEventListener("keyup",flipGravity);
    window.requestAnimationFrame(update);
}

var blocks = [];
var player = addPlayer(svg,30,maxy/2,blocks);

initialize();

