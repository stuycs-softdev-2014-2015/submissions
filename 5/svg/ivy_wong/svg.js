var div = document.getElementById("svg-div");
var svg = document.getElementById("s");
var mx = 0;
var my = 0;

var createCircle = function(x,y,r,dx,dy,color){
    return {
        cx:x,
        cy:y,
        r:r,
        color:color,
        dx:dx,
        dy:dy,
        move:function(){
            if(this.cx > 600-r || this.cx < 0 + r){
                this.dx = this.dx*-1;
                
            }
            if(this.cy > 500-r || this.cy < 0 + r){
                this.dy = this.dy*-1;
            }
            this.cx = this.cx + this.dx;
            this.cy = this.cy + this.dy;
        },
        draw:function(){
            var c = document.createElementNS("http://www.w3.org/2000/svg","circle");
            c.setAttribute("cx",this.cx);
            c.setAttribute("cy",this.cy);
            c.setAttribute("r",this.r);
            c.setAttribute("fill",this.color);            
            c.addEventListener("mouseover",hover);
            svg.appendChild(c);
        }
    };
};

var update = function(){
    while (s.lastChild) {
        s.removeChild(s.lastChild);
    }
    for(var i = 0; i < bubbles.length; i++){
        if(dist(bubbles[i].cx, bubbles[i].cy, mx, my) < 50){
            bubbles[i].color = "#00ff00";
            bubbles[i].dx = bubbles[i].dx*-1;  
            bubbles[i].dy = bubbles[i].dy*-1;
            bubbles[i].cx -= bubbles[i].dx;  
            bubbles[i].cy -= bubbles[i].dy;  
            //console.log("Found close.");
        } else {
            bubbles[i].color = "#ff0000";
        }
        bubbles[i].move();
        bubbles[i].draw();
    }
    window.requestAnimationFrame(update);
};

var dist = function(x0, y0, x1, y1){
   return Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));    
};

var hover = function(e){
    mx = e.offsetX;
    my = e.offsetY;
    //console.log("Hover!");
};

bubbles = [];
for(var i = 0; i < 20; i++){
    bubbles[i] = createCircle(Math.random()*550 + 20, Math.random()*400 + 20, Math.random()*15 + 5, Math.random()*3+2, Math.random()*3+2,"#ff0000");  
    //bubbles[i].addEventListener("mouseover",hover);
};

svg.addEventListener("mousemove",hover);
window.requestAnimationFrame(update);
