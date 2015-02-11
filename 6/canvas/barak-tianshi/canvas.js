var width = 800;
var height = 600;
//random number between min and max
var randNum = function(min, max) {
    return Math.floor(Math.random() * (max-min+1)) + min;
}

var mx=0;
var my=0;
//amount of kernels
var k=randNum(5,25);
var done=false;

//canvas
var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

//kernel "class"
function kernel(x,y) {
    var self = this;
    self.image = new Image();
    self.image.src = 'kernel.png';
    self.popcornW = 70;
    self.popcornH = 65;
    self.kernelW = 40;
    self.kernelH = 36;
    self.pos = [x,y];
    self.acc = 1;
    self.heat = 0;
    self.popped = false;
    self.pop = function() {
	self.popped = true;
	self.image.src = 'popcorn.png';
    }
    self.draw = function() {
	if (!self.popped) {
	    ctx.drawImage(self.image,self.pos[0]-self.kernelW/2, self.pos[1]-self.kernelH/2);
	}
	else {
	    ctx.drawImage(self.image,self.pos[0]-self.popcornW/2-10, self.pos[1]-self.popcornH/2);
	}
    }
}

var kernels = [];

//spawn k random kernels
for (var i=0;i<k;i++) {
    var x = randNum(50,750);
    var y = randNum(50,550);
    kernels.push(new kernel(x,y));
}

canvas.onclick = function(e){
    mx = e.offsetX;
    my = e.offsetY;
    for (var i=0;i<k;i++){
	if ((kernels[i].pos[0] - mx >-20 && kernels[i].pos[0] - mx <20)
	    && (kernels[i].pos[1] - my >-20 && kernels[i].pos[1] - my <20)){
	    kernels[i].pop();
	    console.log(kernels[i]);
	}
    }
}

var update = function(e) {
    ctx.fillStyle = "#000f000";

    //there's a pretty good reason that these loops are separate, but that reason doesn't really apply here... just keep it like this

    for (var i=0;i<kernels.length;i++) {
	kernels[i].draw();
    }
    var finished = true;
    for (var i=0;i<k;i++){
	finished = finished && kernels[i].popped;
    }
    if (finished && !done){
	alert("YOU POPPED THEM ALL!");
	done = true;
    }
    window.requestAnimationFrame(update);
}

canvas.addEventListener("click",update); //do NOT change it to mousemove unless you deleted mousePos.
window.requestAnimationFrame(update);
