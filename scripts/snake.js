/*
Will Trost (wjt218)
last updated: 6/30/17
*/

//which direction the snake is currently facing
var direction = "n";
//size of the board
var numrows = 20;
var numcols = 35;
var delay = 100;
//indicates whether the game is currently running
var running = false;
var status = "ready";
//limits user input to one move per render frame
var moved = false;
var cheat = false
//how long the snake is
var score = 0;
var highscore = 0;
//where the snake is on the board
var snake = [
	[numrows - 2,Math.ceil(numcols / 2)],
	[numrows - 1,Math.ceil(numcols / 2)]
];

//dictionary of images for easy reference
var sprites = {
	grass:	"sprites/grass_orig.png",
	bodyh:	"sprites/bodyh_orig.png",
	bodyv:	"sprites/bodyv_orig.png",
	bodyne:	"sprites/bodyne_orig.png",
	bodyse:	"sprites/bodyse_orig.png",
	bodysw:	"sprites/bodysw_orig.png",
	bodynw:	"sprites/bodynw_orig.png",
	headn:	"sprites/headn_orig.png",
	heade:	"sprites/heade_orig.png",
	heads:	"sprites/heads_orig.png",
	headw:	"sprites/headw_orig.png",
	tailn:	"sprites/tailn_orig.png",
	taile:	"sprites/taile_orig.png",
	tails:	"sprites/tails_orig.png",
	tailw:	"sprites/tailw_orig.png",
	dheadn:	"sprites/dheadn_orig.png",
	dheade:	"sprites/dheade_orig.png",
	dheads:	"sprites/dheads_orig.png",
	dheadw:	"sprites/dheadw_orig.png",
	apple:	"sprites/apple_orig.png"
};

//generate the field
function createGrid() {
	var s = "<div id='board' style='width:"+(numcols*20)+"px'>";
	for (var r = 1; r <= numrows; r++){
		s += "<div class='row' id='row"+r+"' style = 'clear:left;'>";
		for (var c = 1; c <= numcols; c++){
			s += "<div class='cell' id='"+r+"-"+c+"' style = 'float:left; height:20px;'>";
			s += "<img src='"+sprites.grass+"'>";
			s += "</div>";
		}
		s += "</div>";
	}
	s += "</div";
	$("#snakeboardframe").append(s);
}

//get the HTML document object at the location
function getCell(row, col) {
	return $("#"+row+"-"+col);
}

//change the cell at the specified location
function setCell(row, col, cell){
	getCell(row, col).html("<img src='"+cell+"'>");
}

//get the object at the specified location
function getSprite(row, col){
	if (row <= 0 || row >= (numrows + 1) || col <= 0 || col >= (numcols + 1)){
		return "wall";
	}
	switch (getCell(row, col).html()){
		case '<img src="'+sprites.grass+'">':
			return "grass";
		case '<img src="'+sprites.apple+'">':
			return "apple";
		default:
			return "snake";
	}
}

//get the cell directly in front of the snake
function getForwardCoords(){
	var head = snake[0];
	var x = head[1];
	var y = head[0];
	switch(direction){
		case "n":
			return [y - 1, x];
		case "e":
			return [y, x + 1];
		case "s":
			return [y + 1, x];
		case "w":
		default:
			return [y, x - 1];
	}
}

//point to the cell after the current cell
function getDirectionRear(index){
	var vector1 = snake[index]; //this
	var x1 = vector1[1];
	var y1 = vector1[0];
	var vector2 = snake[index + 1]; //after this
	var x2 = vector2[1];
	var y2 = vector2[0];
	if (y1 === y2){ //same row
		if (x1 > x2){ //right
			return "w";
		}
		else{ //left
			return "e";
		}
	}
	else{ //same column
		if (y1 < y2){ //up
			return "s";
		}
		else{ //down
			return "n";
		}
	}
}

//point to the cell before the current cell
function getDirectionFront(index){
	var vector1 = snake[index]; //this
	var x1 = vector1[1];
	var y1 = vector1[0];
	var vector2 = snake[index - 1]; //before this
	var x2 = vector2[1];
	var y2 = vector2[0];
	if (y1 === y2){ //same row
		if (x1 > x2){ //right
			return "w";
		}
		else{ //left
			return "e";
		}
	}
	else{ //same column
		if (y1 < y2){ //up
			return "s";
		}
		else{ //down
			return "n";
		}
	}
}

//determines which sprites to put on the board based on where the snake is
function drawSnake(){
	var len = snake.length;
	var head = "";
	switch (getDirectionRear(0)){
		case "n":
			head = sprites.heads;
			break;
		case "e":
			head = sprites.headw;
			break;
		case "s":
			head = sprites.headn;
			break;
		case "w":
			head = sprites.heade;
		default:
			break;
	}
	setCell(snake[0][0], snake[0][1], head);
	for (var i = 1; i < len - 1; i++){
		var front = getDirectionFront(i);
		var rear = getDirectionRear(i);
		var cur = "";
		switch (front+rear){
			case "we":
			case "ew":
				cur = sprites.bodyh;
				break;
			case "sn":
			case "ns":
				cur = sprites.bodyv;
				break;
			case "ne":
			case "en":
				cur = sprites.bodyne;
				break;
			case "se":
			case "es":
				cur = sprites.bodyse;
				break;
			case "sw":
			case "ws":
				cur = sprites.bodysw;
				break;
			case "nw":
			case "wn":
				cur = sprites.bodynw;
			default:
				break;
		}
		setCell(snake[i][0], snake[i][1], cur);
	}
	var tail = "";
	switch (getDirectionFront(len - 1)){
		case "s":
			tail = sprites.tails;
			break;
		case "w":
			tail = sprites.tailw;
			break;
		case "n":
			tail = sprites.tailn;
			break;
		case "e":
			tail = sprites.taile;
		default:
			break;
	}
	setCell(snake[len - 1][0], snake[len-1][1], tail);
}

//stuff that happens when the game is lost
function lose(){
	//console.log("ow");
	var headc = snake[0];
	var x = headc[1];
	var y = headc[0];
	var head = "";
	switch (getDirectionRear(0)){
		case "n":
			head = sprites.dheads;
			break;
		case "e":
			head = sprites.dheadw;
			break;
		case "s":
			head = sprites.dheadn;
			break;
		case "w":
			head = sprites.dheade;
		default:
			break;
	}
	setCell(y, x, head);
	running = false;
	status = "dead";
	$("#start").html("Reset");
}

//put an apple anywhere on the board. if the random location is the snake, repeat until an empty spot is found
function placeApple(){
	if (!cheat){
		var x = Math.floor((Math.random() * numcols) + 1);
		var y = Math.floor((Math.random() * numrows) + 1);
		var sprite = getSprite(y, x);
		if (sprite == "grass"){
			setCell(y, x, sprites.apple);
		}
		else{
			placeApple();
		}
	}
}

//make the snake move, decide what happens based on the square in front of the snake
function renderStep(){
	var coords = getForwardCoords();
	var sprite = getSprite(coords[0], coords[1]);
	switch (sprite){
		case "apple":
			score = score + 1;
			$("#score").html("Score: "+score);
			if (score >= highscore){
				highscore = score;
				$("#high").html("High: "+highscore);
			}
			//console.log("yum");
			var newsnake = [];
			newsnake.push(coords);
			for (var i = 0; i < snake.length; i++){
				newsnake.push(snake[i]);
			}
			snake = newsnake;
			drawSnake();
			placeApple();
			break;
		case "grass":
			//move forward
			var newsnake = [];
			newsnake.push(coords);
			for (var i = 0; i < snake.length - 1; i++){
				newsnake.push(snake[i]);
			}
			setCell(snake[snake.length - 1][0], snake[snake.length - 1][1], sprites.grass);
			snake = newsnake;
			drawSnake();
			break;
		case "snake":
		case "wall":
			lose();
			break;
	}
	moved = false;
}

//easter egg
function egg(){
	if (status == "ready"){
		cheat = true;
		for (var r = 1; r <= numrows; r++){
			for (var c = 1; c <= numcols; c++){
				if (getSprite(r, c) == "grass"){
					setCell(r, c, sprites.apple);
				}
			}
		}
	}
}

//control direction
function left(){
	//console.log("left");
	if (!moved && running && (direction != "e")){
		direction = "w";
		moved = true;
	}
}

function up(){
	//console.log("up");
	if (!moved && running && (direction != "s")){
		direction = "n";
		moved = true;
	}
}

function right(){
	//console.log("right");
	if (!moved && running && (direction != "w")){
		direction = "e";
		moved = true;
	}
}

function down(){
	//console.log("down");
	if (!moved && running && (direction != "n")){
		direction = "s";
		moved = true;
	}
}

//bind movement to arrow keys
$(document).keydown(function(key) {
	//console.log(key.which);
	switch(key.which) {
		case 37:
			left();
			break;
		case 38:
			up();
			break;
		case 39:
			right();
			break;
		case 40:
			down();
			break;
		case 81:
			egg();
		default:
			break;
	}
	key.preventDefault();
});

//run the game
async function loop() {
	while (running) {
		renderStep();
		await new Promise(r => setTimeout(r, delay));
	}
}

//reset the board
function setUp(){
	for (var r = 1; r <= numrows; r++){
		for (var c = 1; c <= numcols; c++){
			setCell(r, c, sprites.grass);
		}
	}
	snake = [
		[numrows - 2,Math.ceil(numcols / 2)],
		[numrows - 1,Math.ceil(numcols / 2)]
	];
	drawSnake();
	direction = "n";
	score = 0;
	$("#score").html("Score: 0");
	running = false;
	cheat = false;
}

//handle the button click
function buttonclic(){
	switch (status){
		case "ready":
			$("#start").html("Pause");
			status = "playing";
			running = true;
			placeApple();
			loop();
			break;
		case "playing":
			$("#start").html("Resume");
			status = "paused";
			running = false;
			break;
		case "paused":
			$("#start").html("Pause");
			status = "playing";
			running = true
			loop();
			break;
		case "dead":
			$("#start").html("Start");
			status = "ready";
			setUp();
	}
}

//load everything
$(function() {
	createGrid();
	setUp();
	$("#start").click(buttonclic);
});