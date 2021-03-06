var CANVAS_WIDTH = 1000;
var CANVAS_HEIGHT = 600;

var STREET_SIZE = 20
var SPACE_BETWEEN_STREETS = 80
var BLOCK_SIZE = STREET_SIZE + SPACE_BETWEEN_STREETS;

var STREET_COLOR = "#000000";

var TURN_PROBABILITY = 0.25;
var PERSON_SIZE = (3 / 4) * STREET_SIZE;
var PERSON_SPEED = 1;
var INITIAL_INFECTION_PROBABILITY = 0.10;

var makePerson = function(x,y,w,h,dx,dy, healthStatus, people, ctx) {
    return {
        x : x,
        y : y,
        w : w,
        h : h,
        ctx : ctx,
        dx : dx,
        dy : dy,
        healthStatus : healthStatus,
        people : people,
        color : "#ff0000",

        draw : function() {
            if (this.healthStatus == "alive")
                this.color = "#00ff00";
            else if (this.healthStatus == "infected")
                this.color = "#ff0000";

            ctx.fillStyle = this.color;
            ctx.fillRect(this.x,this.y,this.w,this.h);
        },
        
        // IF we find ourselves in intersection:
            // There's a TURN_PROBABILITY chance of going left, and the same probability of going right
        move : function() {
            if (this.isOnIntersection()) {
                var rand = Math.random();
		//Turn right
		//if (rand < TURN_PROBABILITY){
		if (true){
		    if (this.dx == PERSON_SPEED){
                this.dx = 0;
                this.dy = -1 * PERSON_SPEED;
		    }		
		    else if (this.dx == -1 * PERSON_SPEED){
                this.dx = 0;
                this.dy = PERSON_SPEED;
		    }
		    else if (this.dy == PERSON_SPEED){
                this.dy = 0;
                this.dx = PERSON_SPEED;
		    }
		    else if (this.dy == -1 * PERSON_SPEED){
                this.dy = 0;
                this.dx = -1 * PERSON_SPEED;
		    }
		}	
		//Turn Left
		else if (rand < 2*TURN_PROBABILITY){
		    if (dx == PERSON_SPEED){
			dx = 0;
			dy = PERSON_SPEED;
		    }		
		    else if (dx == -1 * PERSON_SPEED){
			dx = 0;
			dy = -1 * PERSON_SPEED;
		    }
		    else if (dy == PERSON_SPEED){
			dy = 0;
			dx = -1 * PERSON_SPEED;
		    }
		    else if (dy == -1 * PERSON_SPEED){
			dy = 0;
			dx = PERSON_SPEED;
		    }
		}
            }

            // If taking a step would run us into a wall, turn around

            this.x = this.x + this.dx;
            this.y = this.y + this.dy;
            if (this.x <= 0 || this.x >= CANVAS_WIDTH)
                this.dx = this.dx * -1;
            if (this.y <= 0 || this.y >= CANVAS_HEIGHT)
                this.dy = this.dy * -1;
        },
        isOnPerson : function(person) {
            return (this.x == person.x && this.y == person.y);
        },
	checkForInfections : function(people) {
	    if (this.healthStatus == "infected") {
	        for (var i = 0; i < this.people.length; i++) {
                if (this.people[i].healthStatus != "immune" && this.people[i].healthStatus != "dead") {
                    if ((this.x >= this.people[i].x && this.x <= (this.people[i].x + this.people[i].w) && this.y >= this.people[i].y && this.y <= (this.people[i].y + this.people[i].h))
                    || ((this.people[i].x >= this.x && this.people[i].x <= (this.x + this.w) && this.people[i].y >= this.y && this.people[i].y <= (this.y + this.h))))
                        this.people[i].healthStatus = "infected";
                }
            }
	    }
	    return this.people;
	},
        // This function returns a function.
        // Every time we're checking intersections we call this function,
        // and it returns a function suitable for our direction.
        // The function that it returns takes an intersection as parameter
        // and tells us if we're on it.
        // We check three things: If we're not yet through the intersection's
        // middle, if we'll be through the middle after movement, and if
        // we're approximately on the same level
        generateIntersectionFunction : function() {
            var intersectionFunction;

            // Moving right
            if (this.dx > 0 && this.dy == 0) {
                intersectionFunction = function(intersection) {
                    return this.x < intersection.x && 
                        this.x + dx >= intersection.x &&
                        Math.abs(this.y - intersection.y) < STREET_SIZE;
                };
            }
            // Moving left
            else if (this.dx < 0 && this.dy == 0) {
                intersectionFunction = function(intersection) {
                    return this.x > intersection.x && 
                        this.x + dx <= intersection.x &&
                        Math.abs(this.y - intersection.y) < STREET_SIZE;
                };
            }
            // Moving up
            else if (this.dx == 0 && this.dy < 0) {
                intersectionFunction = function(intersection) {
                    return this.y > intersection.y && 
                        this.y + dy <= intersection.y &&
                        Math.abs(this.x - intersection.x) < STREET_SIZE;
                };
            }
            // Moving down
            else if (this.dx == 0&& this.dy > 0) {
                intersectionFunction = function(intersection) {
                    return this.y < intersection.y && 
                        this.y + dy >= intersection.y &&
                        Math.abs(this.x - intersection.x) < STREET_SIZE;
                };
            }
            return intersectionFunction;
        },

        // People can't just turn when they *intersect* with an intersection.
        // They need to be *on* the intersection.
        // Of course we might set up movement in a way that a person is never exactly on 
        // an intersection
        // But a good measure is if they're about to cross its middle.
        // If the next step would take this person across the intersection's center,
        // the person is on the intersection
        isOnIntersection : function() {
            // Generate an intersection function that is made just for our
            // specific dy and x
            var doesIntersect = this.generateIntersectionFunction();
            for (var i = 0; i < gridIntersections.length; i++) {
                if (doesIntersect(gridIntersections[i]))
                    return true;
	    	}
	    return false;
        }
    };
};

// A street, which is essentially a rectangle, and can be either horizontal or vertical
var makeStreet = function(ctx, orientation, size, x, y, color) {
    return {
        ctx : ctx,
        orientation : orientation,
        size : size,
        x : x,
        y : y,
        color : color,

        draw : function() {
            ctx.fillStyle = this.color;
            if (orientation == "vertical")
                ctx.fillRect(this.x, this.y, this.size, CANVAS_HEIGHT);
            else if (orientation == "horizontal") {
                ctx.fillRect(this.x, this.y, CANVAS_WIDTH, this.size);
            }
        }
    };
};

// The intersection made by two streets
// Whenever a person enters an intersection, there is a TURN_PROBABILITY chance he'll
// turn left, and an equal chance he'll turn right.
var makeIntersection = function(x, y, width, height) {
    return {
        x : x,
        y : y,
        width : width,
        height : height,
        draw : function() {
            ctx.fillStyle = "#0000ff";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

var update = function(){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);

    for (var i = 0; i < people.length; i++) {
        people[i].move();
        people[i].checkForInfections();
    }

    for (var i = 0; i < gridRectangles.length; i++) {
        gridRectangles[i].draw(); 
    }

    for (var i = 0; i < people.length; i++) {
        people[i].draw();
    }

    //for (var i = 0; i < gridIntersections.length; i++) {
    //    gridIntersections[i].draw(); 
    //}

    window.requestAnimationFrame(update);
}

var addRandomPerson = function(){
    var x = 100;
    var y = 100;
    var w = 10+Math.random(20);
    var h = 20+Math.random(40);
    people.push(makePerson(x,y,w,h,ctx));
    
};

var generateGrid = function() {
    var verticalStreets = [];
    var horizontalStreets = [];

    // Used by people to know when to turn
    var intersections = [];

    // Fit as many streets as possible
    var numVerticalStreets = Math.floor(CANVAS_WIDTH / BLOCK_SIZE);
    var numHorizontalStreets = Math.floor(CANVAS_HEIGHT / BLOCK_SIZE);

    // Added to vertical streets so that they're centered
    var offsetX = (CANVAS_WIDTH - numVerticalStreets * BLOCK_SIZE) / 2;

    // Added to horizontal streets so that they're centered
    var offsetY = (CANVAS_HEIGHT - numHorizontalStreets * BLOCK_SIZE) / 2;

    // Generate vertical streets
    // Each vertical street has some space to its left, then a street, and then some space to its right
    for (var i = 0; i < numVerticalStreets; i++) {
        var leftCornerOfBlock = BLOCK_SIZE * i + offsetX;

        var centerOfStreet = leftCornerOfBlock + (SPACE_BETWEEN_STREETS / 2);
        var leftCornerOfStreet = centerOfStreet - (STREET_SIZE / 2);

        var newStreet = makeStreet(ctx, "vertical", STREET_SIZE, leftCornerOfStreet, 0, STREET_COLOR);
        verticalStreets.push(newStreet);
    }

    // Generate horizontal streets
    // Each horizontal street has some space above, then a street, and then some space below
    for (var i = 0; i < numHorizontalStreets; i++) {
        var topCornerOfBlock = BLOCK_SIZE * i + offsetY;

        var centerOfStreet = topCornerOfBlock+ (SPACE_BETWEEN_STREETS / 2);
        var topCornerOfStreet = centerOfStreet - (STREET_SIZE / 2);

        var newStreet = makeStreet(ctx, "horizontal", STREET_SIZE, 0, topCornerOfStreet, STREET_COLOR);
        horizontalStreets.push(newStreet);
    }

    // For every combination of horizontal & vertical street (that is, for every intersection),
    // Add to `intersections`
    for (var v = 0; v < verticalStreets.length; v++) {
        for (var h = 0; h < horizontalStreets.length; h++) {
            var x_coor = verticalStreets[v].x;
            var y_coor = horizontalStreets[h].y;
            var newIntersection = makeIntersection(x_coor, y_coor, STREET_SIZE, STREET_SIZE);
            intersections.push(newIntersection);
        }
    }

    // Merge arrays
    var allStreets = verticalStreets.concat(horizontalStreets);

    return [intersections, allStreets];
}

var spawnPeople = function() {
    for (var i = 0; i < gridIntersections.length; i++) {
        var intersection = gridIntersections[i];
        var offsetX = (STREET_SIZE - PERSON_SIZE) / 2;
        var offsetY = offsetX;
        var newX = intersection.x + offsetX;
        var newY = intersection.y + offsetY;

        var rand = Math.random();
        var dx = 0;
        var dy = 0;
        if (rand <= 0.25)
            dx = -PERSON_SPEED;
        else if (rand <= 0.50)
            dx = PERSON_SPEED;
        else if (rand <= 0.75)
            dy = -PERSON_SPEED;
        else
            dy = PERSON_SPEED;

        var healthStatus = "alive";
        if (rand < INITIAL_INFECTION_PROBABILITY)
            healthStatus = "infected";

        var newPerson = makePerson(newX, newY, PERSON_SIZE, PERSON_SIZE, dx, dy, healthStatus, people, ctx);
        people.push(newPerson);
    }
}

var startGame  = function(e) {
    var grid = generateGrid();
    gridIntersections = grid[0];
    gridRectangles = grid[1];
    var people = spawnPeople();
    window.requestAnimationFrame(update);
}

var resetGame = function(e) {
    location.reload();
}

var people = [];
var gridIntersections = [];
var gridRectangles = [];

var c = document.getElementById("game-canvas");
c.width = CANVAS_WIDTH;
c.height = CANVAS_HEIGHT;

var start = document.getElementById("start-button");
start.addEventListener("click", startGame);

var reset = document.getElementById("reset-button");
reset.addEventListener("click", resetGame);

var ctx = c.getContext("2d");
