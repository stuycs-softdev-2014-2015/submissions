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

var VACCINE_REFILL_SPEED = 0.3;
var MAX_VACCINE_LEVEL = 100;
var VACCINE_COST = 100;
var VACCINE_COLOR = "rgb(200, 0, 200)";
var VACCINE_HOVER_COLOR = "rgb(255, 180, 255)";
var VACCINE_SVG = "images/vaccine.svg";
var VACCINE_RADIUS = STREET_SIZE * 1.5;
var VACCINE_CIRCLE_STROKE = "rgb(200, 0, 200)";
var VACCINE_CIRCLE_FILL = "rgb(255, 180, 255)";

var CURE_REFILL_SPEED = 0.5;
var MAX_CURE_LEVEL = 100;
var CURE_COST = 100;
var CURE_COLOR = "rgb(50, 200, 50)";
var CURE_HOVER_COLOR = "rgb(170, 255, 170)";
var CURE_SVG = "images/cure.svg";
var CURE_RADIUS = STREET_SIZE * 1.5;
var CURE_CIRCLE_STROKE = "rgb(50, 200, 50)";
var CURE_CIRCLE_FILL = "rgb(170, 255, 170)";

// Fraction of toolbar dimensions
var BUTTON_WIDTH = 0.20;
var BUTTON_HEIGHT = 1.0;

// Fraction of button dimensions
var BUTTON_PADDING = 0.05;

// In pixels, not fraction
var DISTANCE_BETWEEN_BUTTONS = 10;
var BUTTON_TEXT_HEIGHT = 20;

var ACTION_BUTTON_ALPHA = 0.65;

var DYING_RATE = 0.075;
var DECAY_RATE = 0.25;
