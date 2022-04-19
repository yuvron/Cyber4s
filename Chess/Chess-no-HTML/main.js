const GAME_SIZE = 8;
const BOARD_SIZE = GAME_SIZE + 2;
const CHESS_TYPES = ["PAWN", "ROOK", "KNIGHT", "BISHOP", "QUEEN", "KING", "BISHOP", "KNIGHT", "ROOK"];
const WHITE_PIECES1 = ["♙", "♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"];
const BLACK_PIECES1 = ["♟", "♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"];
const WHITE_PIECES = [
	'<i class="fa-regular fa-chess-pawn"></i>',
	'<i class="fa-regular fa-chess-rook"></i>',
	'<i class="fa-regular fa-chess-knight"></i>',
	'<i class="fa-regular fa-chess-bishop"></i>',
	'<i class="fa-regular fa-chess-queen"></i>',
	'<i class="fa-regular fa-chess-king"></i>',
	'<i class="fa-regular fa-chess-bishop"></i>',
	'<i class="fa-regular fa-chess-knight"></i>',
	'<i class="fa-regular fa-chess-rook"></i>',
];
const BLACK_PIECES = [
	'<i class="fa-solid fa-chess-pawn"></i>',
	'<i class="fa-solid fa-chess-rook"></i>',
	'<i class="fa-solid fa-chess-knight"></i>',
	'<i class="fa-solid fa-chess-bishop"></i>',
	'<i class="fa-solid fa-chess-queen"></i>',
	'<i class="fa-solid fa-chess-king"></i>',
	'<i class="fa-solid fa-chess-bishop"></i>',
	'<i class="fa-solid fa-chess-knight"></i>',
	'<i class="fa-solid fa-chess-rook"></i>',
];
// const BOARD = [];
let chosenCell = undefined;
let availableMoves = [];

//Creates a table element (the board) and appending it all the rows and cells of the table
function createBoard() {
	const table = document.createElement("table");
	table.id = "board";
	document.body.appendChild(table);
	let isSideRow = false; //Side rows contain only letters and are not part of the game
	let isSideColumn = false; //Side columns contain only numbers and are not part of the game
	//loop to create 10 rows (8 for the game, 2 for the letters)
	for (let i = BOARD_SIZE - 1; i >= 0; i--) {
		const row = table.insertRow();
		isSideRow = i == 0 || i == BOARD_SIZE - 1;
		for (let j = 0; j < BOARD_SIZE; j++) {
			const cell = row.insertCell();
			isSideColumn = j == 0 || j == BOARD_SIZE - 1;
			if (isSideRow) {
				cell.classList.add("letter");
				if (isSideColumn) cell.classList.add("number");
				else cell.innerText = String.fromCharCode(j + 64); //65 = A (ASCII)
			} else {
				if (isSideColumn) {
					cell.classList.add("number");
					cell.innerText = i;
				} else {
					cell.classList.add("tile");
					cell.id = j - 1 + "-" + (i - 1);
					cell.addEventListener("click", (event) => cellClicked(event, j - 1, i - 1));
					if (i % 2 == 0) {
						if (j % 2 == 0) cell.classList.add("black");
						else cell.classList.add("white");
					} else {
						if (j % 2 == 0) cell.classList.add("white");
						else cell.classList.add("black");
					}
				}
			}
		}
	}
	return table;
}

function initializeBoard(table) {
	const board = [];
	rows = [...table.rows];
	rows.shift(); //Remove the first row (letters)
	rows.pop(); //Remove the last row (letters)
	for (let i = rows.length - 1; i >= 0; i--) {
		board[i] = [];
		cells = [...rows[i].cells];
		cells.shift(); //Remove the first column (numbers)
		cells.pop(); //Remove the last column (numbers)
		for (const j in cells) {
			if (i == 0) {
				cells[j].innerHTML = BLACK_PIECES[+j + 1];
				board[i][j] = new Piece(CHESS_TYPES[+j + 1], "WHITE", +j, i);
			} else if (i == 1) {
				cells[j].innerHTML = BLACK_PIECES[0];
				board[i][j] = new Piece("PAWN", "WHITE", +j, i);
			} else if (i == cells.length - 2) {
				cells[j].innerHTML = WHITE_PIECES[0];
				board[i][j] = new Piece("PAWN", "BLACK", +j, i);
			} else if (i == cells.length - 1) {
				cells[j].innerHTML = WHITE_PIECES[+j + 1];
				board[i][j] = new Piece(CHESS_TYPES[+j + 1], "BLACK", +j, i);
			} else board[i][j] = undefined;
		}
	}
	return board;
}

function updateBoard(newPos, lastPos) {
	newPos.innerHTML = lastPos.innerHTML;
	lastPos.innerHTML = "";
	const turn = document.getElementById("turn");
	if (game.turn == "WHITE") {
		turn.className = "white-turn";
		turn.innerText = "White Turn";
	} else {
		turn.className = "black-turn";
		turn.innerText = "Black Turn";
	}
}

function cellClicked(e, x, y) {
	//A function that toggles all the highlighted cells back
	const toggleBack = () => {
		chosenCell.classList.toggle("selected");
		for (const cell of availableMoves) cell.classList.toggle("move");
		availableMoves = [];
	};
	//Checking if the clicked cell is not a possible move from an earlier click
	if (!availableMoves.includes(e.currentTarget)) {
		//Checking if there is a previous clicked cell, if so unmarking it
		if (chosenCell) toggleBack();
		if (chosenCell == e.currentTarget) chosenCell = undefined;
		else {
			let piece = game.getPiece(x, y);
			if (piece && piece.color == game.turn) {
				chosenCell = e.currentTarget;
				chosenCell.classList.toggle("selected");
				let moves = piece.getMoves(game.board);
				if (moves) {
					for (const move of moves) {
						const el = document.getElementById(move[0] + "-" + move[1]);
						if (el) {
							el.classList.toggle("move");
							availableMoves.push(el);
						}
					}
				}
			} else chosenCell = undefined;
		}
		//Handling moves clicks
	} else {
		let lastId = chosenCell.id.split("-");
		let lastX = lastId[0];
		let lastY = lastId[1];
		if (game.movePiece(lastX, lastY, x, y)) {
			updateBoard(e.currentTarget, chosenCell);
			toggleBack();
			chosenCell = undefined;
		}
	}
}

const table = createBoard();
const game = new Game(initializeBoard(table));
