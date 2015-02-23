var CANVAS_WIDTH = 1000;
var CANVAS_HEIGHT = 600;

var FULL_TOOLBAR_HEIGHT = 100;
var FULL_TOOLBAR_WIDTH = CANVAS_WIDTH;

var TOOLBAR_PADDING_VERTICAL = 10;
var TOOLBAR_PADDING_HORIZ = 10;

var TOOLBAR_WIDTH = FULL_TOOLBAR_WIDTH - 2 * TOOLBAR_PADDING_HORIZ;
var TOOLBAR_HEIGHT = FULL_TOOLBAR_HEIGHT - 2 * TOOLBAR_PADDING_VERTICAL;
var TOOLBAR_Y = CANVAS_HEIGHT - TOOLBAR_HEIGHT;

var GAME_WIDTH = CANVAS_WIDTH;
var GAME_HEIGHT = CANVAS_HEIGHT - FULL_TOOLBAR_HEIGHT;

var STREET_SIZE = 20
var SPACE_BETWEEN_STREETS = 80
var BLOCK_SIZE = STREET_SIZE + SPACE_BETWEEN_STREETS;

var STREET_COLOR = "#000000";

var TURN_PROBABILITY = 0.15;
var PERSON_SIZE = (3 / 4) * STREET_SIZE;
var PERSON_SPEED = 1;
var INITIAL_INFECTION_PROBABILITY = 0.10;

var VACCINE_REGENERATION = 10;
var MAX_VACCINE_LEVEL = 100;
var VACCINE_COST = 100;
var VACCINE_COLOR = "#00ff00";
var VACCINE_SVG = "images/vaccine.svg";

var CURE_REGENERATION = 5;
var MAX_CURE_LEVEL = 100;
var CURE_COST = 100;
var CURE_COLOR = "#ff00ff";
var CURE_SVG = "images/cure.svg";

// Fraction of toolbar dimensions
var BUTTON_WIDTH = 0.20;
var BUTTON_HEIGHT = 1.0;

// In pixels, not fraction
var DISTANCE_BETWEEN_BUTTONS = 10;

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
          just_turned : false,
          color : "#ff0000",

          draw : function() {
              if (this.healthStatus == "alive")
                  this.color = "#00ff00";
              else if (this.healthStatus == "infected")
                  this.color = "#ff0000";
              else if (this.healthStatus == "immune")
                    this.color = "#0000ff";

              ctx.fillStyle = this.color;
              ctx.fillRect(this.x,this.y,this.w,this.h);
          },

          // IF we find ourselves in intersection:
          // There's a TURN_PROBABILITY chance of going left, and the same probability of going right
          move : function() {
              if (!this.just_turned && this.isOnIntersection()) {
                  var rand = Math.random();
                  //Turn right
                  if (rand < TURN_PROBABILITY){
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
                  else if (rand < 2 * TURN_PROBABILITY){
                      if (this.dx == PERSON_SPEED){
                          this.dx = 0;
                          this.dy = PERSON_SPEED;
                      }		
                      else if (this.dx == -1 * PERSON_SPEED){
                          this.dx = 0;
                          this.dy = -1 * PERSON_SPEED;
                      }
                      else if (this.dy == PERSON_SPEED){
                          this.dy = 0;
                          this.dx = -1 * PERSON_SPEED;
                      }
                      else if (this.dy == -1 * PERSON_SPEED){
                          this.dy = 0;
                          this.dx = PERSON_SPEED;
                      }
                  }
                  this.just_turned = true;
                  if (this.dy != 0)
                      this.fixHorizPositioning();
                  else if (this.dx != 0)
                      this.fixVerticalPositioning();
              }
              else {
                  this.just_turned = false;
              }

              // If taking a step would run us into a wall, turn around

              this.x = this.x + this.dx;
              this.y = this.y + this.dy;

              if (this.x <= 0 || (this.x + PERSON_SIZE) >= GAME_WIDTH)
                  this.dx = this.dx * -1;
              if (this.y <= 0 || (this.y + PERSON_SIZE) >= GAME_HEIGHT)
                  this.dy = this.dy * -1;
          },

            // When a person turns they're usually misaligned with the street
            fixHorizPositioning: function() {
                // "vertical_street" is the vertical street we're probably on
                // "current_street" is used for iteration
                var vertical_street, current_street;

                // Compare positions for every street
                for (i = 0; i < gridRectangles.length; i++) {
                    current_street = gridRectangles[i];

                    if (current_street.orientation == "vertical") {
                        if (Math.abs(current_street.x - this.x) < STREET_SIZE) {
                            vertical_street = current_street;
                            break;
                        }
                    }
                }

                if (vertical_street)
                    this.x = (vertical_street.x + STREET_SIZE / 2) - PERSON_SIZE / 2;
            },
            //
            // When a person turns they're usually misaligned with the street
            fixVerticalPositioning: function() {
                // "horiz_street" is the horiz street we're probably on
                // "current_street" is used for iteration
                var horiz_street, current_street;

                // Compare positions for every street
                for (i = 0; i < gridRectangles.length; i++) {
                    current_street = gridRectangles[i];

                    if (current_street.orientation == "horizontal") {
                        if (Math.abs(current_street.y - this.y) < STREET_SIZE) {
                            horiz_street = current_street;
                            break;
                        }
                    }
                }

                if (horiz_street)
                    this.y = (horiz_street.y + STREET_SIZE / 2) - PERSON_SIZE / 2;
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
          generateIntersectionFunction : function(person) {
              var intersectionFunction;

              // Moving right
              if (person.dx > 0 && person.dy == 0) {
                  intersectionFunction = function(intersection) {
                      return person.x < intersection.x && 
                          person.x + person.dx >= intersection.x &&
                          Math.abs(person.y - intersection.y) < STREET_SIZE;
                  };
              }
              // Moving left
              else if (person.dx < 0 && person.dy == 0) {
                  intersectionFunction = function(intersection) {
                      return person.x > intersection.x && 
                          person.x + person.dx <= intersection.x &&
                          Math.abs(person.y - intersection.y) < STREET_SIZE;
                  };
              }
              // Moving up
              else if (person.dx == 0 && person.dy < 0) {
                  intersectionFunction = function(intersection) {
                      return person.y > intersection.y && 
                          person.y + person.dy <= intersection.y &&
                          Math.abs(person.x - intersection.x) < STREET_SIZE;
                  };
              }
              // Moving down
              else if (person.dx == 0&& person.dy > 0) {
                  intersectionFunction = function(intersection) {
                      return person.y < intersection.y && 
                          person.y + person.dy >= intersection.y &&
                          Math.abs(person.x - intersection.x) < STREET_SIZE;
                  };
              }
              return intersectionFunction;
          },

          // People can't just turn when they *intersect* with an intersection.
          // They need to be *on* the intersection.
          // It might so happen that we set up movement in a way that a person is never exactly on 
          // an intersection
          // But a good measure is if they're about to cross its middle.
          // If the next step would take this person across the intersection's center,
          // the person is on the intersection
          isOnIntersection : function() {
              // Generate an intersection function that is made just for our
              // specific dy and dx
              var doesIntersect = this.generateIntersectionFunction(this);
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
                    ctx.fillRect(this.x, this.y, this.size, GAME_HEIGHT);
                else if (orientation == "horizontal") {
                    ctx.fillRect(this.x, this.y, GAME_WIDTH, this.size);
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

var makeToolButton = function(x, y, width, height, initial_level, color, logo_url, ctx) {
    return {
        x : x,
        y : y,
        width : width,
        height : height,
        level : initial_level,
        color: color,
        logo_url : logo_url,
        logo : null,
        logo_loaded : false,
        ctx : ctx,

        logoLoaded : function(button_reference) {
            button_reference.logo_loaded = true;
        },

        draw : function() {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            //ctx.fill();
            ctx.stroke();

            if (this.logo == null) {
                this.logo = new Image();
                var button_reference = this;
                this.logo.onload = function() { button_reference.logoLoaded(button_reference) };
                this.logo.src = this.logo_url;
            }

            if (this.logo_loaded) {
                var logo_width = 0.3 * this.width;
                var logo_height = logo_width * (this.logo.height / this.logo.width);

                var logo_left_corner = this.x + 0.05 * this.width;
                var logo_top_corner = this.y + 0.05 * this.height;

                ctx.drawImage(this.logo, logo_left_corner, logo_top_corner, logo_width, logo_height);
            }
        }
    }
}

var update = function(){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,GAME_WIDTH, GAME_HEIGHT);

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

    vaccine_button.draw();
    cure_button.draw();

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
    var numVerticalStreets = Math.floor(GAME_WIDTH / BLOCK_SIZE);
    var numHorizontalStreets = Math.floor(GAME_HEIGHT / BLOCK_SIZE);

    // Added to vertical streets so that they're centered
    var offsetX = (GAME_WIDTH - numVerticalStreets * BLOCK_SIZE) / 2;

    // Added to horizontal streets so that they're centered
    var offsetY = (GAME_HEIGHT - numHorizontalStreets * BLOCK_SIZE) / 2;

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
var createVaccineButton = function() {
    var width = TOOLBAR_WIDTH * BUTTON_WIDTH;
    var right_corner_x = TOOLBAR_WIDTH + TOOLBAR_PADDING_HORIZ;
    var left_corner_x = right_corner_x - width;

    var height = TOOLBAR_HEIGHT * BUTTON_HEIGHT;
    var bisector_y = TOOLBAR_Y + (TOOLBAR_HEIGHT / 2) - TOOLBAR_PADDING_VERTICAL;
    var top_corner_y = bisector_y - height / 2;

    vaccine_button = makeToolButton(left_corner_x, top_corner_y, width, height, MAX_VACCINE_LEVEL, VACCINE_COLOR, VACCINE_SVG, ctx);
}

var createCureButton = function() {
    var width = TOOLBAR_WIDTH * BUTTON_WIDTH;
    var right_corner_x = vaccine_button.x - DISTANCE_BETWEEN_BUTTONS;
    var left_corner_x = right_corner_x - width;

    var height = TOOLBAR_HEIGHT * BUTTON_HEIGHT;
    var bisector_y = TOOLBAR_Y + (TOOLBAR_HEIGHT / 2) - TOOLBAR_PADDING_VERTICAL;
    var top_corner_y = bisector_y - height / 2;

    cure_button = makeToolButton(left_corner_x, top_corner_y, width, height, MAX_VACCINE_LEVEL, CURE_COLOR, CURE_SVG, ctx);
}

var startGame  = function(e) {
    var grid = generateGrid();
    gridIntersections = grid[0];
    gridRectangles = grid[1];
    spawnPeople();
    createVaccineButton();
    createCureButton();
    window.requestAnimationFrame(update);
}

var resetGame = function(e) {
    location.reload();
}

var people = [];
var gridIntersections = [];
var gridRectangles = [];

var vaccine_button, cure_button;

var c = document.getElementById("game-canvas");
c.width = CANVAS_WIDTH;
c.height = CANVAS_HEIGHT;

var start = document.getElementById("start-button");
start.addEventListener("click", startGame);

var reset = document.getElementById("reset-button");
reset.addEventListener("click", resetGame);

var ctx = c.getContext("2d");
