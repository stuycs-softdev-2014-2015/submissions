var c = document.getElementById("c");
var ctx = c.getContext("2d");



var makeBall = function(x,y,ctx) {
    return {
        x : x,
        y : y,
        r : 25, //8
        //dx : Math.random()*10-5,
        dx : 1,
        //dy : Math.random()*10-5,
        dy : 1,
        ctx : ctx,
        color : "#ff0000",
        draw : function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            //ctx.fillStyle = 'green';
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = '#003300';
            ctx.stroke();
            ctx.closePath();
        },
        move : function() {
            if (this.x - this.r < 0 || this.x + this.r > 640){
                this.dx = this.dx * -1;
            }
            if (this.y - this.r < 0 || this.y + this.r > 480){
                this.dy = this.dy * -1;
            }
            this.x = this.x + this.dx;
            this.y = this.y + this.dy;
        }
        
    };
};

var inRadius = function(e){
    /*for each (var item in obj) {
        sum += item;
    }*/
    var x = e.offsetX;
    var y = e.offsetY;
   
    for (i = 0; i < balls.length; i++){
        var distance = Math.sqrt( Math.pow(balls[i].x - x, 2) + Math.pow(balls[i].y - y, 2) );
        if (distance < balls[i].r){
            return i;
        }
    }
    return null;
    
};


var update = function() {
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,640,480);
    ctx.closePath();
    
    for (var i = 0; i < balls.length; i++){
        balls[i].move();
        balls[i].draw();
    }
     
    window.requestAnimationFrame(update);
};

/*var clicked = function(e){
    var x = e.offsetX;
    var y = e.offsetY;
    balls.push(makeBall(x,y,ctx));
};*/

var clicked = function(e){
    if (!inRadius(e)){
        var x = e.offsetX;
        var y = e.offsetY;
        balls.push(makeBall(x,y,ctx));
    } else {
        var pos = inRadius(e);
        balls[pos].color = "#0000ff";
    }
};

c.addEventListener("click",clicked);

 
var balls = [];
balls.push(makeBall(50,100,ctx));
balls.push(makeBall(400,300,ctx));
window.requestAnimationFrame(update);

