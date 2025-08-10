/*
Will Trost (wjt218)
date created: 6/30/17
last updated: 8/10/25
*/

//which direction the snake is currently facing
var direction = "n";
//size of the board
var numrows = 20;
var numcols = 35;
var delay = 100;
//indicates whether the game is currently running
var running = false;
var gstatus = "ready";
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
	var board = document.createElement("div");
	board.id = "board"
	board.style = "width:" + (numcols * 20) + "px";
	for (var r = 1; r <= numrows; r++){
		var row = document.createElement("div");
		row.class = "row";
		row.id = "row" + r;
		row.style = "clear:left;";
		for (var c = 1; c <= numcols; c++){
			var tile = document.createElement("div");
			tile.class = "cell";
			tile.id = "row" + r + "col" + c;
			tile.style = "float:left; height:20px;"
			var img = document.createElement("img");
			img.class = "grass";
			img.id = r + "-" + c;
			img.src = sprites.grass;
			tile.append(img);
			row.append(tile);
		}
		board.append(row);
	}
	document.getElementById("snakeboardframe").append(board);
}

//get the HTML document object at the location
function getCell(row, col) {
	return document.getElementById(row + "-" + col);
}

//change the cell at the specified location
function setCell(row, col, cell){
	var img = getCell(row, col);
	img.src = sprites[cell];
	img.class = cell;
}

//get the object at the specified location
function getSprite(row, col){
	if (row <= 0 || row >= (numrows + 1) || col <= 0 || col >= (numcols + 1)){
		return "wall";
	} else {
		return getCell(row, col).class;
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
			head = "heads";
			break;
		case "e":
			head = "headw";
			break;
		case "s":
			head = "headn";
			break;
		case "w":
			head = "heade";
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
				cur = "bodyh";
				break;
			case "sn":
			case "ns":
				cur = "bodyv";
				break;
			case "ne":
			case "en":
				cur = "bodyne";
				break;
			case "se":
			case "es":
				cur = "bodyse";
				break;
			case "sw":
			case "ws":
				cur = "bodysw";
				break;
			case "nw":
			case "wn":
				cur = "bodynw";
			default:
				break;
		}
		setCell(snake[i][0], snake[i][1], cur);
	}
	var tail = "";
	switch (getDirectionFront(len - 1)){
		case "s":
			tail = "tails";
			break;
		case "w":
			tail = "tailw";
			break;
		case "n":
			tail = "tailn";
			break;
		case "e":
			tail = "taile";
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
			head = "dheads";
			break;
		case "e":
			head = "dheadw";
			break;
		case "s":
			head = "dheadn";
			break;
		case "w":
			head = "dheade";
		default:
			break;
	}
	setCell(y, x, head);
	running = false;
	gstatus = "dead";
	document.getElementById("start").textContent = "Reset";
}

//put an apple anywhere on the board. if there are no empty spaces, do nothing
function placeApple(){
	var spaces = [];
	for (var r = 1; r <= numrows; r++){
		for (var c = 1; c <= numcols; c++){
			if (getSprite(r, c) == "grass"){
				spaces.push(getCell(r, c));
			}
		}
	}
	if (spaces.length > 0){
		var pick = spaces[Math.floor(Math.random() * spaces.length)]
		pick.class = "apple"
		pick.src = sprites.apple;
	}
}

//make the snake move, decide what happens based on the square in front of the snake
function renderStep(){
	var coords = getForwardCoords();
	var sprite = getSprite(coords[0], coords[1]);
	switch (sprite){
		case "apple":
			score = score + 1;
			document.getElementById("score").textContent = "Score: " + score;
			if (score >= highscore){
				highscore = score;
				document.getElementById("high").textContent = "High: " + score;
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
			setCell(snake[snake.length - 1][0], snake[snake.length - 1][1], "grass");
			snake = newsnake;
			drawSnake();
			break;
		case "snake":
		case "wall":
		default:
			lose();
			break;
	}
	moved = false;
}

//easter egg
function egg(){
	if (gstatus == "ready"){
		cheat = true;
		for (var r = 1; r <= numrows; r++){
			for (var c = 1; c <= numcols; c++){
				if (getSprite(r, c) == "grass"){
					setCell(r, c, "apple");
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
function keyDown(key){
	switch(key.key){
		case "ArrowLeft":
			left();
			break;
		case "ArrowUp":
			up();
			break;
		case "ArrowRight":
			right();
			break;
		case "ArrowDown":
			down();
			break;
		case "q":
			egg();
		default:
			break;
	}
}

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
			setCell(r, c, "grass");
		}
	}
	snake = [
		[numrows - 2,Math.ceil(numcols / 2)],
		[numrows - 1,Math.ceil(numcols / 2)]
	];
	drawSnake();
	direction = "n";
	score = 0;
	document.getElementById("score").textContent = "Score: 0";
	running = false;
	cheat = false;
}

//handle the button click
function buttonclic(){
	switch (gstatus){
		case "ready":
			document.getElementById("start").textContent = "Pause";
			gstatus = "playing";
			running = true;
			placeApple();
			loop();
			break;
		case "playing":
			document.getElementById("start").textContent = "Resume";
			gstatus = "paused";
			running = false;
			break;
		case "paused":
			document.getElementById("start").textContent = "Pause";
			gstatus = "playing";
			running = true
			loop();
			break;
		case "dead":
			document.getElementById("start").textContent = "Start";
			gstatus = "ready";
			setUp();
	}
}

//load everything
window.onload = function(){
	createGrid();
	setUp();
	document.onkeydown = keyDown;
	document.getElementById("start").onclick = buttonclic;
};
