const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreDiv = document.getElementById('score');
const pp = document.getElementById('playpause');

const Row = 20;
const Col = 15;
const SQ = 25;
const EmptyColor = '#e2e2e2';

function drawSquare(x, y, color){
	ctx.fillStyle = color;
	ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

	ctx.strokeStyle = '#000000';
	ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

let board = [];
for(let i = 0; i < Row; i++){
	board[i] = [];
	for(let j = 0; j < Col; j++){
		board[i][j] = EmptyColor;
	}
}

function drawBoard(){
	for(let i = 0; i < Row; i++){
		for(let j = 0; j < Col; j++){
			drawSquare(j, i, board[i][j]);
		}
	}
}

drawBoard();

const PIECES = [Z, S, T, O, L, I, J];
const COLORS = ['#ff0000', '#00ff00', '#0000cc', '#ffff00', '#ff00ff', '#00cc99', '#ff6600', '#990033'];

function randomPiece(){
	let r = randomN = Math.floor(Math.random() * PIECES.length);
	let c = Math.floor(Math.random() * COLORS.length);

	// return new Piece(PIECES[5], COLORS[c]);
	return new Piece(PIECES[r], COLORS[c]);
}

let p = randomPiece();

function Piece(piece, color){
	this.piece = piece;
	this.color = color;

	this.pieceN = 0;
	this.activePiece = this.piece[this.pieceN];

	this.x = 6;
	this.y = -1;
}

Piece.prototype.fill = function(color){
	for(let i = 0; i < this.activePiece.length; i++){
		for(let j = 0; j < this.activePiece.length; j++){
			if(this.activePiece[i][j]){
				drawSquare(this.x + j, this.y + i, color);
			}
		}
	}
}

Piece.prototype.draw = function(){
	this.fill(this.color);
}

Piece.prototype.ClearPiece = function(){
	this.fill(EmptyColor);
}

Piece.prototype.moveDown = function(){
	if(!this.checkPosiiton(0, 1, this.activePiece)){
		this.ClearPiece();
		this.y++;
		this.draw();
	} else {
		this.lockPiece();
		p = randomPiece();
	}
}

Piece.prototype.moveRight = function(){
	if(!this.checkPosiiton(1, 0, this.activePiece)){
		this.ClearPiece();
		this.x++;
		this.draw();
	}
}

Piece.prototype.moveLeft = function(){
	if(!this.checkPosiiton(-1, 0, this.activePiece)){
		this.ClearPiece();
		this.x--;
		this.draw();
	}
}

Piece.prototype.rotate = function(){
	let nextPattern = this.piece[(this.pieceN + 1)%this.piece.length];
	let kick = 0;
	let dontrotate = 1;

	if(this.checkPosiiton(0, 0, nextPattern)){
		if(this.x > Col/2){
			kick = -1;
		} else {
			kick = 1;
		}
	}

	if(nextPattern === I[0]){
		dontrotate = 0;
	} else if(nextPattern === I[2]){
		dontrotate = 2;
	}

	if(!this.checkPosiiton(kick, 0, nextPattern, dontrotate)){
		this.ClearPiece();
		this.x += kick;
		this.pieceN = (this.pieceN + 1)%this.piece.length;
		this.activePiece = this.piece[this.pieceN];
		this.draw();
	}
}
let score = 0;

Piece.prototype.lockPiece = function(){
	for(let i = 0; i < this.activePiece.length; i++){
		for(let j = 0; j < this.activePiece.length; j++){
			if(!this.activePiece[i][j]){
				continue;
			}
			if(this.y + i < 0){
				alert("Game Over!!!");
				gameOver = true;
				break;
			}
			board[this.y + i][this.x + j] = this.color;
		}
	}

	for(let i = 0; i < Row; i++){
		let isRowFull = true;
		for(let j = 0; j < Col; j++){
			isRowFull = isRowFull && (board[i][j] != EmptyColor);
		}
		if(isRowFull){
			for(y = i; y > 1; y--){
				for(let j = 0; j < Col; j++){
					board[y][j] = board[y-1][j];
				}	
			}
			for(let j = 0; j < Col; j++){
				board[0][j] = EmptyColor;
			}
			score += 10;
		}
	}

	drawBoard();
	scoreDiv.innerHTML = score;
}

let playpause =  false;
Piece.prototype.PlayPause = function(){
	playpause = !playpause;
	if(!playpause){
		drop();
		pp.innerHTML = '';
	} else {
		pp.innerHTML = 'Paused';
	}
}

Piece.prototype.checkPosiiton = function(x, y, piece, rotate = 1){
	for(let i = 0; i < piece.length; i++){
		for(let j = 0; j < piece.length; j++){
			if(!piece[i][j]){
				continue;
			}
			let newX = this.x + j + x;
			let newY = this.y + i + y;

			if(newX < 0 || newX > Col || newY >= Row){
				return true;
			}

			if(newY < 0){
				continue;
			}

			if(board[newY][newX] != EmptyColor){
				return true;
			}
		}
	}
	return false;
}


document.addEventListener('keydown', Control);

function Control(event){
	if(event.keyCode == 37){
		p.moveLeft();
		DS = Date.now();
	} else if(event.keyCode == 38){
		p.rotate();
		DS = Date.now();
	} else if(event.keyCode == 39){
		p.moveRight();
		DS = Date.now();
	} else if(event.keyCode == 40){
		p.moveDown();
	} else if(event.keyCode == 80){
		p.PlayPause();
	}
}

let DS = Date.now();
let gameOver = false;

function drop(){
	let now = Date.now();
	let delta = now - DS;

	if(delta > 1000){
		p.moveDown();
		DS = Date.now();
	}
	if(!gameOver && !playpause){
		requestAnimationFrame(drop);
	}
}
drop();